import React from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/atoms/Link";
import * as SC from "./styles";
import { NavBarProps } from "./types";
import { useAuth } from "@/context/AuthContext";

const NavigationBar: React.FC<NavBarProps> = () => {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  // Navigationslinks für die Hauptseiten der App
  // "always: true" bedeutet, dass der Link immer angezeigt wird (auch wenn der Nutzer nicht eingeloggt ist)
  // "always: false" bedeutet, dass der Link nur für eingeloggte Nutzer sichtbar ist
  // Füge hier "Analytics" als geschützte Seite hinzu
  const links = [
    { href: "/", label: "Home", always: true },
    { href: "/cards", label: "Cards", always: false },
    { href: "/learn", label: "Learn", always: false },
    { href: "/analytics", label: "Analytics", always: false },
    { href: "/how-to", label: "How-To", always: true },
    { href: "/profile", label: "Profile", always: false },
  ];

  const isActiveLink = (href: string): boolean => {
    if (!pathname) return false;
    return pathname === href;
  };

  if (isLoggedIn === null) return null;

  return (
    <SC.NavBar>
      {links
        .filter((link) => link.always || isLoggedIn)
        .map((link) => {
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
