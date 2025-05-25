import { DatabaseData } from '../database/dbtypes';

const STORAGE_KEY = 'flashcards';

export const storageService = {
  getData: (): DatabaseData => {
    if (typeof window === 'undefined') return { folders: [] };
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { folders: [] };
  },

  setData: (data: DatabaseData): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  updateCardBoxLevel: (folderId: string, updatedCards: any[]) => {
    const data = storageService.getData();
    const newFolders = data.folders.map((folder: any) =>
      folder.id === folderId // <-- Korrektur: id statt folderId
        ? { ...folder, cards: updatedCards }
        : folder
    );
    storageService.setData({ ...data, folders: newFolders });
  },

  updateSingleCardBoxLevel: (folderId: string, cardId: string, newBoxLevel: number) => {
    const data = storageService.getData();
    const newFolders = data.folders.map((folder) => {
      if (folder.id !== folderId) return folder;
      return {
        ...folder,
        cards: folder.cards.map((card) =>
          card.id === cardId ? { ...card, boxLevel: newBoxLevel } : card
        ),
      };
    });
    storageService.setData({ ...data, folders: newFolders });
  },
};