const API_BASE = "https://web-engineering-karteikarten-60iw2vp6l-proettgens-projects.vercel.app/api";

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// Folder-API
export const apiService = {
    // Folders
    getFolders: (params?: { search?: string; limit?: number; offset?: number; sortBy?: string; order?: string }) => {
        const query = new URLSearchParams();
        if (params?.search) query.append("title", params.search); // oder "name", je nach Backend
        if (params?.limit) query.append("limit", params.limit.toString());
        if (params?.offset) query.append("offset", params.offset.toString());
        if (params?.sortBy) query.append("sortBy", params.sortBy);
        if (params?.order) query.append("order", params.order);
        return fetch(`/api/folders?${query.toString()}`).then(res => res.json());
    },
    getFolder: (id: string) => request(`${API_BASE}/folders/${id}`),
    createFolder: (data: any) => request(`${API_BASE}/folders`, { method: "POST", body: JSON.stringify(data) }),
    updateFolder: (id: string, data: any) => request(`${API_BASE}/folders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteFolder: (id: string) => request(`${API_BASE}/folders/${id}`, { method: "DELETE" }),

    // Cards
    getCards: (params?: Record<string, any>) => {
        const query = params ? "?" + new URLSearchParams(params).toString() : "";
        return request(`${API_BASE}/cards${query}`);
    },
    getCard: (id: string) => request(`${API_BASE}/cards/${id}`),
    createCard: (data: any) => request(`${API_BASE}/cards`, { method: "POST", body: JSON.stringify(data) }),
    updateCard: (id: string, data: any) => request(`${API_BASE}/cards/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteCard: (id: string) => request(`${API_BASE}/cards/${id}`, { method: "DELETE" }),

    // Cards by Folder
    getCardsByFolder: (folderId: string, params?: Record<string, any>) => {
        const query = params ? "?" + new URLSearchParams(params).toString() : "";
        return request(`${API_BASE}/folders/${folderId}/cards${query}`);
    },
};