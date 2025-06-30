/**
 * IMPORTANT: Type Synchronization Notice
 *
 * If you make changes to this file, please run `npm run sync-types` from the project root. (npm run sync-types) [Root]
 * This will copy the updated types to the Frontend for type safety and consistency.
 */

export interface Card {
    id: string;
    title: string;
    question: string;
    answer: string;
    currentLearningLevel: number;
    createdAt: string;
    tags: string[] | null;
    folderId: string;
}

export interface CardFilter {
    folderId?: string;
    tags?: string;
    title?: string;
    limit?: number;
    offset?: number;
    sortField?: string;
    sortOrder?: string;
}