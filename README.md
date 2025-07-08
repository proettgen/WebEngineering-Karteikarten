# WebEngineering-Karteikarten - Read Me

This is a modern web application for creating, organizing, and reviewing flashcards online. The application is built with Next.js, React, TypeScript, and Styled Components, and is optimized for both performance and developer experience.

If you are employed by DHBW Karlsruhe and are evaluating this project, please visit our [wiki](https://github.com/proettgen/WebEngineering-Karteikarten/wiki). 

## Live App

You can access the live version of the app here:  
[https://proettgen.github.io/WebEngineering-Karteikarten/](https://proettgen.github.io/WebEngineering-Karteikarten/)

---

## Getting Started for Developers

Follow the steps below to run the project locally.

### Prerequisites

- Node.js (version 18 or higher recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/proettgen/WebEngineering-Karteikarten.git
cd WebEngineering-Karteikarten
```

2. Install dependencies:

```bash
npm i
cd Frontend
npm i
cd ..
cd Backend
nmp i
```

## Scripts

The following scripts are available for development and production workflows in the **root directory**:

- `npm run dev`  
  Starts the development server using Next.js with Turbopack enabled at [http://localhost:3000](http://localhost:3000).

  Starts the Backend express.js at [http://localhost:8080](http://localhost:8080).

- `npm run build`  
  Builds the production application and generates [Swagger documentation](https://petstore.swagger.io/?url=https://web-engineering-karteikarten.vercel.app/api/api-docs/swagger.json#/).

Additionally, the following scripts can be run in the **Frontend directory**:

- `npm run dev`  
  Starts the development server using Next.js with Turbopack enabled at [http://localhost:3000](http://localhost:3000).

- `npm run build`  
  Builds the production frontend.

- `npm run start`  
  Starts the production build locally at [http://localhost:3000](http://localhost:3000).
  
- `npm run lint`  
  Runs ESLint to check for code quality and style issues.

Additionally, the following scripts can be run in the **Backend directory**:

- `npm run dev`  
  Starts the Backend express.js at [http://localhost:8080](http://localhost:8080).
  
- `npm run build`  
  Builds the production backend and generates [Swagger documentation](https://petstore.swagger.io/?url=https://web-engineering-karteikarten.vercel.app/api/api-docs/swagger.json#/).

- `npm run test`  
  Runs Tests to check if the Backend is working correctly.
  
- `npm run lint`  
  Runs ESLint to check for code quality and style issues.
