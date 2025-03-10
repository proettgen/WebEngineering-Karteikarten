"use client";

import React from "react";
import Link from "next/link";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";
import NavigationBar from "@/components/molecules/NavigationBar";

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
      <Button $variant="primary">Primary </Button>
      <Button $variant="secondary">Secondary </Button>
      <Button $variant="accept">Accept </Button>
      <Button $variant="deny">Deny </Button>
      <br />
      <br />
      <NavigationBar></NavigationBar>
    </SC.Container>
  );
}

export default TestTemplate;
