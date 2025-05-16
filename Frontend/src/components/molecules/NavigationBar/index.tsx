import React from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/atoms/Link";
import * as SC from "./styles";
import { NavBarProps } from "./types";

const NavigationBar: React.FC<NavBarProps> = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/cards", label: "Cards" },
    { href: "/test", label: "Test" },
    { href: "/learn", label: "Learn" },
  ];

  const isActiveLink = (href: string): boolean => {
    if (!pathname) return false;
    // Use exact match for all links
    return pathname === href;
  };

  return (
    <SC.NavBar>
      {links.map((link) => {
        const active = isActiveLink(link.href);

        return (
          <Link
            href={link.href}
            key={link.href}
            color="textPrimary"
            size="medium"
          >
            <SC.NavItem $active={active}>{link.label}</SC.NavItem>
          </Link>
        );
      })}
    </SC.NavBar>
  );
};

export default NavigationBar;
