import Link from "next/link";

//Definiert die Seite unter der Route /Home

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
