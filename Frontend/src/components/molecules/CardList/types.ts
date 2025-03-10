export interface CardListProps {
  cards: { title: string; question: string; answer: string; tags: string[] }[];
  onDelete: (index: number) => void; 
}