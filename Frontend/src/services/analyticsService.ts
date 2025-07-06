import type { Analytics } from '../database/analyticsTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/analytics';


export const getAnalytics = async (): Promise<Analytics | null> => {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
};


export const updateAnalytics = async (id: string, data: Partial<Omit<Analytics, 'id' | 'updatedAt'>>): Promise<Analytics | null> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return await res.json();
};


export const createAnalytics = async (data: Omit<Analytics, 'id' | 'updatedAt'>): Promise<Analytics | null> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return await res.json();
};


export const deleteAnalytics = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return res.ok;
};
