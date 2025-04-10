import React from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/atoms/Link";
import * as SC from "./styles";
import { NavBarProps } from "./types";

const NavigationBar: React.FC<NavBarProps> = () => {
  const pathname = usePathname();

  const links = [
    { href: "/home", label: "Home" },
    { href: "/cards", label: "Cards" },
    { href: "/test", label: "Test" },
    { href: "/learn", label: "Learn" },
  ];

  const isActiveLink = (href: string): boolean => {
    if (!pathname) return false;

    // Für Root-Pfad nur exakte Übereinstimmung verwenden
    if (href === "/") {
      return pathname === "/home" || pathname === "/";
    }
    // Für andere Pfade prüfen, ob der aktuelle Pfad mit dem Link-Pfad beginnt
    return pathname.startsWith(href);
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
