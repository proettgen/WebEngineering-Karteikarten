"use client";

import React from "react";
import Link from "next/link";
import * as SC from "./styles";

function TestTemplate() {
  return (
    <SC.Container>
      <header>This is the Test</header>
      <main>
        Welcome. exiting here! <br />
        now go back: <Link href="/">Home Page</Link> <br />
        manage your cards: <Link href="/CardManagerPage">Card Manager</Link>
      </main>
      <footer>Lorem Ipsum</footer>
    </SC.Container>
  );
}

export default TestTemplate;