import ThemeWrapper from "../src/components/templates/ThemeWrapper/ThemeWrapper";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head />
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
