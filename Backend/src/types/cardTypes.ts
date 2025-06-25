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