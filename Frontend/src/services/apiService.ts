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

    // Hierarchical folders for Aside
    getRootFolders: (params?: { limit?: number; offset?: number }) => {
        const query = params ? "?" + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : "";
        return request(`${API_BASE}/folders/root${query}`);
    },
    getChildFolders: (parentId: string, params?: { limit?: number; offset?: number }) => {
        const query = params ? "?" + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : "";
        return request(`${API_BASE}/folders/${parentId}/children${query}`);
    },

    // Cards (general operations)
    getCards: (params?: Record<string, any>) => {
        const query = params ? "?" + new URLSearchParams(params).toString() : "";
        return request(`${API_BASE}/cards${query}`);
    },
    getCard: (id: string) => request(`${API_BASE}/cards/${id}`),

    // Cards within folder context (recommended for CRUD operations)
    getCardsByFolder: (folderId: string, params?: Record<string, any>) => {
        const query = params ? "?" + new URLSearchParams(params).toString() : "";
        return request(`${API_BASE}/folders/${folderId}/cards${query}`);
    },
    createCardInFolder: (folderId: string, data: any) => 
        request(`${API_BASE}/folders/${folderId}/cards`, { method: "POST", body: JSON.stringify(data) }),
    updateCardInFolder: (folderId: string, cardId: string, data: any) => 
        request(`${API_BASE}/folders/${folderId}/cards/${cardId}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteCardInFolder: (folderId: string, cardId: string) => 
        request(`${API_BASE}/folders/${folderId}/cards/${cardId}`, { method: "DELETE" }),
};