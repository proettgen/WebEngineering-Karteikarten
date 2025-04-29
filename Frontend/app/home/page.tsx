"use client";
import HomeTemplate from "../../src/components/templates/HomeTemplate/HomeTemplate";

// Defines the page under the route /Home

/*
Directory structure:

app/
├── layout.tsx
├── page.tsx
├── Home/
│   └── page.tsx
├── Test/
│   └── page.tsx
templates/
├── HomeTemplate.tsx
├── TestTemplate.tsx
*/

/*Why such a structure?:
1. Reusability -> Templates can be used for multiple pages
2. Scalability -> Easy addition of new pages
3. Testability, clarity -> Logic, presentation, and routing are separated
4. Maintainability -> Easy adjustment of templates
5. Extensibility -> Simple addition of new templates
6. Consistency -> Uniform structure for all pages
7. Performance -> Only required templates are loaded
*/

function Home() {
  return <HomeTemplate />;
}

export default Home;
