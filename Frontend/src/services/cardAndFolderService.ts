import { request } from "./httpClient";
import type {
  FolderInput,
  FolderUpdateInput,
  FolderListResponse,
  FolderResponse,
} from "@/database/folderTypes";
import type {
  CardInput,
  CardUpdateInput,
  CardFilter,
  CardListResponse,
  CardResponse,
} from "@/database/cardTypes";

// Simple filter type for folders (inline definition)
interface FolderQueryParams {
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  order?: string;
}

// Folder-API
export const cardAndFolderService = {
  // Folders
  getFolders: (params?: FolderQueryParams): Promise<FolderListResponse> => {
    // Use a high limit to get all folders by default (can be overridden)
    const queryParams: Record<string, string> = {
      limit: (params?.limit || 100).toString(),
      offset: (params?.offset || 0).toString()
    };
    if (params?.search) queryParams.search = params.search;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.order) queryParams.order = params.order;
    
    const query = "?" + new URLSearchParams(queryParams).toString();
    return request(`/folders${query}`, { credentials: 'include' });
  },
  searchFolders: (
    searchTerm: string,
    params?: { limit?: number; offset?: number },
  ): Promise<FolderListResponse> => {
    const queryParams: Record<string, string> = { search: searchTerm };
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.offset) queryParams.offset = params.offset.toString();
    const query = "?" + new URLSearchParams(queryParams).toString();
    return request(`/folders/search${query}`, { credentials: 'include' });
  },
  getFolder: (id: string): Promise<FolderResponse> => 
    request(`/folders/${id}`, { credentials: 'include' }),
  createFolder: (data: FolderInput): Promise<FolderResponse> =>
    request("/folders", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: 'include',
    }),
  updateFolder: (id: string, data: FolderUpdateInput): Promise<FolderResponse> =>
    request(`/folders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      credentials: 'include',
    }),
  deleteFolder: (id: string): Promise<void> => 
    request(`/folders/${id}`, { 
      method: "DELETE",
      credentials: 'include'
    }),

  // Cards (general operations)
  getCards: (params?: CardFilter): Promise<CardListResponse> => {
    const query = params ? "?" + new URLSearchParams(params as any).toString() : "";
    return request(`/cards${query}`, { credentials: 'include' });
  },
  getCard: (id: string): Promise<CardResponse> => 
    request(`/cards/${id}`, { credentials: 'include' }),

  // Cards within folder context (recommended for CRUD operations)
  getCardsByFolder: (folderId: string, params?: CardFilter): Promise<CardListResponse> => {
    // Use the working endpoint: /api/cards with folderId filter
    const queryParams = { folderId, ...params };
    const query = "?" + new URLSearchParams(queryParams as any).toString();
    return request(`/cards${query}`, { credentials: 'include' });
  },
  createCardInFolder: (folderId: string, data: CardInput): Promise<CardResponse> =>
    // Use folder-specific endpoint for better validation
    request(`/folders/${folderId}/cards`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: 'include',
    }),
  updateCardInFolder: (folderId: string, cardId: string, data: CardUpdateInput): Promise<CardResponse> =>
    // Use folder-specific endpoint for proper validation
    request(`/folders/${folderId}/cards/${cardId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      credentials: 'include',
    }),
  deleteCardInFolder: (folderId: string, cardId: string): Promise<void> =>
    // Use folder-specific endpoint
    request(`/folders/${folderId}/cards/${cardId}`, {
      method: "DELETE",
      credentials: 'include',
    }),
};
