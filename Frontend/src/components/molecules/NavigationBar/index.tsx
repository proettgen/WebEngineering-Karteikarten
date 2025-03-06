import React from "react";
import * as SC from "./styles";
import { NavigationBarProps } from "./types";
import Logo from "@/components/atoms/Logo";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import SearchBar from "../SearchBar";

export default function NavigationBar({
  logoSrc,
  links,
  onSearch,
}: NavigationBarProps) {
  return (
    <SC.NavBar>
      <Logo src={logoSrc} alt="Logo" />
      <SC.NavLinks>
        {links.map((link, index) => (
          <Link key={index} href={link.href}>
            {link.label}
          </Link>
        ))}
      </SC.NavLinks>
      <SearchBar placeholder="Search..." onSearch={onSearch} />
      <Button onClick={() => alert("Login clicked")}>Login</Button>
      <Icon name="user" />
    </SC.NavBar>
  );
}
