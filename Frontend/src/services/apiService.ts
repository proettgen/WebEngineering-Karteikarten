const API_BASE = "https://web-engineering-karteikarten-j9ahtxe1q-proettgens-projects.vercel.app/api";

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(url, {
        headers: { 
            "Content-Type": "application/json",
        },
        ...options,
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
    }
    
    return res.json();
};

// Folder-API
export const apiService = {
    // Folders
    getFolders: (_params?: { search?: string; limit?: number; offset?: number; sortBy?: string; order?: string }) => 
        request(`${API_BASE}/folders`),
    getFolder: (id: string) => request(`${API_BASE}/folders/${id}`),
    createFolder: (data: any) => request(`${API_BASE}/folders`, { method: "POST", body: JSON.stringify(data) }),
    updateFolder: (id: string, data: any) => request(`${API_BASE}/folders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteFolder: (id: string) => request(`${API_BASE}/folders/${id}`, { method: "DELETE" }),

    // Cards (general operations)
    getCards: (params?: Record<string, any>) => {
        const query = params ? "?" + new URLSearchParams(params).toString() : "";
        return request(`${API_BASE}/cards${query}`);
    },
    getCard: (id: string) => request(`${API_BASE}/cards/${id}`),

    // Cards within folder context (recommended for CRUD operations)
    getCardsByFolder: (folderId: string, params?: Record<string, any>) => {
        // Use the working endpoint: /api/cards with folderId filter
        const queryParams = { folderId, ...params };
        const query = "?" + new URLSearchParams(queryParams).toString();
        return request(`${API_BASE}/cards${query}`);
    },
    createCardInFolder: (folderId: string, data: any) => 
        // Use general cards endpoint with folderId in data
        request(`${API_BASE}/cards`, { method: "POST", body: JSON.stringify({ ...data, folderId, createdAt: new Date().toISOString() }) }),
    updateCardInFolder: (folderId: string, cardId: string, data: any) => 
        // Use general cards endpoint, folderId is maintained automatically
        request(`${API_BASE}/cards/${cardId}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteCardInFolder: (folderId: string, cardId: string) => 
        // Use general cards endpoint
        request(`${API_BASE}/cards/${cardId}`, { method: "DELETE" }),
};