import { request } from "./httpClient";

// Folder-API
export const cardAndFolderService = {
  // Folders
  getFolders: (params?: {
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    order?: string;
  }) => {
    // Use a high limit to get all folders by default (can be overridden)
    const queryParams: Record<string, string> = {
      limit: (params?.limit || 1000).toString(),
      offset: (params?.offset || 0).toString()
    };
    if (params?.search) queryParams.search = params.search;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.order) queryParams.order = params.order;
    
    const query = "?" + new URLSearchParams(queryParams).toString();
    return request(`/folders${query}`);
  },
  searchFolders: (
    searchTerm: string,
    params?: { limit?: number; offset?: number },
  ) => {
    const queryParams: Record<string, string> = { search: searchTerm };
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.offset) queryParams.offset = params.offset.toString();
    const query = "?" + new URLSearchParams(queryParams).toString();
    return request(`/folders/search${query}`);
  },
  getFolder: (id: string) => request(`/folders/${id}`),
  createFolder: (data: any) =>
    request("/folders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateFolder: (id: string, data: any) =>
    request(`/folders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
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
    // Use folder-specific endpoint for better validation
    request(`/folders/${folderId}/cards`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCardInFolder: (folderId: string, cardId: string, data: any) =>
    // Use folder-specific endpoint for proper validation
    request(`/folders/${folderId}/cards/${cardId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteCardInFolder: (folderId: string, cardId: string) =>
    // Use folder-specific endpoint
    request(`/folders/${folderId}/cards/${cardId}`, {
      method: "DELETE",
    }),
};
