import Link from "next/link";

function Test() {
  return (
    <>
      <header>This is the Test</header>
      <br />
      <main>
        Welcome. exiting here!
        <br />
        <br />
        now go back: <Link href="/">Home Page</Link>
      </main>
      <br />
      <footer>Lorem Ipsum</footer>
    </>
  );
}
export default Test;
