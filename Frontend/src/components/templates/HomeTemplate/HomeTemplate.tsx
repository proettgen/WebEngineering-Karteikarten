"use client";

import React from "react";
import Link from "next/link";
import * as SC from "./styles";

function HomeTemplate() {
  return (
    <SC.Container>
      <header>This is the Homepage</header>
      <main>
        Hello World <br />
        explore our test page: <Link href="/Test">Test Page</Link> <br />
        manage your cards: <Link href="/CardManagerPage">Card Manager</Link>
      </main>
      <footer>Lorem Ipsum</footer>
    </SC.Container>
  );
}

export default HomeTemplate;