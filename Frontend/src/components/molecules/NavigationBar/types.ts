export interface NavLink {
    href: string;
    label: string;
  }
  
  export interface NavigationBarProps {
    logoSrc: string;
    links: NavLink[];
    onSearch: () => void;
  }