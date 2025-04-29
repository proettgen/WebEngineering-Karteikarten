import StyledComponentsRegistry from "../lib/registry";
import ThemeWrapper from "../src/components/templates/ThemeWrapper/ThemeWrapper";
import type { ReactNode } from "react";
/*
Root layout for the application. 
This layout is applied to all pages and routes 
that are located under the app directory.
*/

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body style={{ margin: 0 }}>
        <StyledComponentsRegistry>
          <ThemeWrapper>{children}</ThemeWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
/*The ThemeWrapper is applied to all pages and components of the application.
 This means that the theme is applied to all pages.
*/
