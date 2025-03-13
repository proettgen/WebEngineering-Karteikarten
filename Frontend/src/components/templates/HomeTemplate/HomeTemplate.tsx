import React from "react";
import Link from "@/components/atoms/Link";
import * as SC from "./styles";

function HomeTemplate() {
  return (
    <SC.Container>
      <header>This is the Homepage</header>
      <main>
        Hello World <br />
        explore our test page:{" "}
        <Link href="/Test" color="secondary">
          Test Page
        </Link>{" "}
        <br />
      </main>
      <footer>Lorem Ipsum</footer>
    </SC.Container>
  );
}

export default HomeTemplate;
