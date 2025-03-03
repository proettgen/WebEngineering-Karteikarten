import React from "react";
import * as SC from "./styles";
import { NavigationBarProps } from "./types";
import Logo from "../../atoms/Logo";
import Link from "../../atoms/Link";
import Button from "../../atoms/Button";
import Icon from "../../atoms/Icon";
import SearchBar from "../SearchBar";

export default function NavigationBar({ logoSrc, links, onSearch }: NavigationBarProps) {
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
      <Button label="Login" onClick={() => alert("Login clicked")} />
      <Icon name="user" />
    </SC.NavBar>
  );
}