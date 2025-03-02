export interface Option {
    value: string;
    label: string;
  }
  
  export interface SelectionProps {
    options: Option[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }