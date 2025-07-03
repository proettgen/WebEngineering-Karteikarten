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
    sortBy?: string;
    order?: string;
}