import { LinkProps } from "@/components/atoms/Link/types";

export interface NavBarProps {
  children?: React.ReactNode;
}

export interface NavItemProps {
  active?: boolean;
  children?: React.ReactNode;
}

export interface NavLinkProps extends LinkProps {
  isActive?: boolean;
}
