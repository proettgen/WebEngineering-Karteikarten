import { FC } from "react";
import { availableThemes } from "../../templates/ThemeWrapper/types";

interface HeaderProps {
  setTheme: React.Dispatch<React.SetStateAction<availableThemes>>;
}

const Header: FC<HeaderProps> = ({ setTheme }) => {
  return (
    <header>
      <h1>Header</h1>
      <button
        onClick={() =>
          setTheme((prev) =>
            prev === "lightTheme" ? "darkTheme" : "lightTheme"
          )
        }
      >
        Toggle Theme
      </button>
    </header>
  );
};

export default Header;
