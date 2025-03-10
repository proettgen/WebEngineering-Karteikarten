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
  }
};