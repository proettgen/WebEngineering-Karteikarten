"use client"; // Wichtig für Client Components im App Router

import React from "react";
import { usePathname } from "next/navigation"; // App Router verwendet usePathname
import Link from "@/components/atoms/Link";
import * as SC from "./styles";
import { NavBarProps } from "./types";

const NavigationBar: React.FC<NavBarProps> = () => {
  const pathname = usePathname(); // Ermittelt den aktuellen Pfad im App Router

  // Beispiel-Links
  const links = [
    { href: "/", label: "Home" },
    { href: "/Test", label: "Test" },
    { href: "/services", label: "Dienstleistungen" },
    { href: "/contact", label: "Kontakt" },
  ];

  // Prüft, ob der aktuelle Pfad mit dem Link-Pfad beginnt
  const isActiveLink = (href: string): boolean => {
    // Für Root-Pfad nur exakte Übereinstimmung verwenden
    if (href === "/") {
      return pathname === "/";
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
            <SC.NavItem active={active}>{link.label}</SC.NavItem>
          </Link>
        );
      })}
    </SC.NavBar>
  );
};

export default NavigationBar;
