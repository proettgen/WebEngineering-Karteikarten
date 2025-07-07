import React from "react";
import { usePathname } from "next/navigation";
import Link from "@/components/atoms/Link";
import * as SC from "./styles";
import { NavBarProps } from "./types";
import { useAuth } from "@/context/AuthContext";

const NavigationBar: React.FC<NavBarProps> = () => {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  // Navigation links for the main pages of the app
  // "always: true" means the link is always visible (even if the user is not logged in)
  // "always: false" means the link is only visible for logged-in users
  // Add "Analytics" as a protected page here
  const links = [
    { href: "/", label: "Home", always: true },
    { href: "/cards", label: "Cards", always: false },
    { href: "/learn", label: "Learn", always: false },
    { href: "/analytics", label: "Analytics", always: false },
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
