import ThemeWrapper from "../src/components/templates/ThemeWrapper/ThemeWrapper";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
export default Layout;
