import { request } from "./httpClient";

// Folder-API
export const apiService = {
    // Folders
    getFolders: (_params?: { search?: string; limit?: number; offset?: number; sortBy?: string; order?: string }) => 
        request(`/folders`),
    getFolder: (id: string) => request(`/folders/${id}`),
    createFolder: (data: any) => request(`/folders`, { method: "POST", body: JSON.stringify(data) }),
    updateFolder: (id: string, data: any) => request(`/folders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteFolder: (id: string) => request(`/folders/${id}`, { method: "DELETE" }),

    // Cards (general operations)
    getCards: (params?: Record<string, any>) => {
        const query = params ? "?" + new URLSearchParams(params).toString() : "";
        return request(`/cards${query}`);
    },
    getCard: (id: string) => request(`/cards/${id}`),

    // Cards within folder context (recommended for CRUD operations)
    getCardsByFolder: (folderId: string, params?: Record<string, any>) => {
        // Use the working endpoint: /api/cards with folderId filter
        const queryParams = { folderId, ...params };
        const query = "?" + new URLSearchParams(queryParams).toString();
        return request(`/cards${query}`);
    },
    createCardInFolder: (folderId: string, data: any) => 
        // Use general cards endpoint with folderId in data
        request(`/cards`, { method: "POST", body: JSON.stringify({ ...data, folderId, createdAt: new Date().toISOString() }) }),
    updateCardInFolder: (folderId: string, cardId: string, data: any) => 
        // Use general cards endpoint, folderId is maintained automatically
        request(`/cards/${cardId}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteCardInFolder: (folderId: string, cardId: string) => 
        // Use general cards endpoint
        request(`/cards/${cardId}`, { method: "DELETE" }),
};