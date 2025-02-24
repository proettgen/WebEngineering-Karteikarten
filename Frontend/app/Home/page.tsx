import Link from "next/link";

function Home() {
  return (
    <>
      <header>This is the Homepage</header>
      <main>
        Hello World <br />
        explore our test page: <Link href="../Test">Test Page</Link>
      </main>
      <footer>Lorem Ipsum</footer>
    </>
  );
}
export default Home;
