"use client";
import ThemeWrapper from "../src/components/templates/ThemeWrapper/ThemeWrapper";
import type { ReactNode } from "react";

/*
Root-Layout für die Anwendung. 
Dieses Layout wird auf alle Seiten und Routen angewendet, 
die sich unter dem app Verzeichnis befinden
*/

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head />
      <body style={{ margin: 0 }}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
/*der ThemeWrapper wird um alle Seiten und Komponenten der Anwendung gelegt.
 Das bedeutet, dass das Theme auf alle Seiten angewendet wird.
*/
