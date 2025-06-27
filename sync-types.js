const fs = require("fs");
const path = require("path");

const filesToCopy = [
    "cardTypes.ts",
    "folderTypes.ts"
];

const backendTypesDir = path.join(__dirname, "Backend", "src", "types");
const frontendTypesDir = path.join(__dirname, "Frontend", "src", "database");

if (!fs.existsSync(frontendTypesDir)) {
    fs.mkdirSync(frontendTypesDir, { recursive: true });
}

filesToCopy.forEach((file) => {
    const src = path.join(backendTypesDir, file);
    const dest = path.join(frontendTypesDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Kopiert: ${file}`);
});

console.log("Typen-Synchronisation abgeschlossen.");

//npm run sync-types in Root
//This script copies type definitions from the Backend to the Frontend directory.