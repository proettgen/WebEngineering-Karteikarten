import * as analyticsService from '../services/analyticsService';
import { Request, Response, NextFunction } from 'express';

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getAnalytics();
    if (!data) {
      res.status(404).json({ message: 'Analytics not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const createAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.createAnalytics(req.body as Omit<import('../types/analyticsTypes').Analytics, 'id' | 'updatedAt'>);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export const updateAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = await analyticsService.updateAnalytics(id, req.body as Partial<Omit<import('../types/analyticsTypes').Analytics, 'id' | 'updatedAt'>>);
    if (!data) {
      res.status(404).json({ message: 'Analytics not found' });
      return;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await analyticsService.deleteAnalytics(id);
    if (!deleted) {
      res.status(404).json({ message: 'Analytics not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
