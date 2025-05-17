import StyledComponentsRegistry from "../lib/registry";
import ThemeWrapper from "../src/components/templates/ThemeWrapper/ThemeWrapper";
import type { ReactNode } from "react";
/*
Root layout for the application. 
This layout is applied to all pages and routes 
that are located under the app directory.
*/

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="de">
    <body style={{ margin: 0 }}>
      <StyledComponentsRegistry>
        <ThemeWrapper>{children}</ThemeWrapper>
      </StyledComponentsRegistry>
    </body>
  </html>
);
export default RootLayout;
/*The ThemeWrapper is applied to all pages and components of the application.
 This means that the theme is applied to all pages.
*/
