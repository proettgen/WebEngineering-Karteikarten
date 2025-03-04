import React from "react";
import Link from "next/link";

function TestTemplate() {
  return (
    <>
      <header>This is the Test</header>
      <main>
        Welcome. exiting here! <br />
        now go back: <Link href="/">Home Page</Link> <br />
        manage your cards: <Link href="/CardManagerPage">Card Manager</Link>
      </main>
      <footer>Lorem Ipsum</footer>
    </>
  );
}

export default TestTemplate;