import HomeTemplate from "../../src/components/templates/HomeTemplate/HomeTemplate";


//Definiert die Seite unter der Route /Home

/*
Verzeichnisstruktur:

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

/*Warum so eine Struktur?:
1. Wiederverwendbarkeit -> Templates können für mehrere Seiten genutzt werden
2. Skalierbarkeit -> einfaches Hinzufügen von neuen Seiten
3. Testbarkeit,Übersichtlichkeit -> Logik und Darstellung, Routing sind getrennt
4. Wartbarkeit -> einfache Anpassung von Templates
5. Erweiterbarkeit -> einfaches Hinzufügen von neuen Templates
6. Konsistenz -> einheitliche Struktur für alle Seiten
7. Performance -> nur benötigte Templates werden geladen
*/

function Home() {
  return <HomeTemplate />;
}

export default Home;