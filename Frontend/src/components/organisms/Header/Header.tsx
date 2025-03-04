import { FC } from "react";
import { availableThemes } from "../../templates/ThemeWrapper/types";
import * as SC from "./styles";

interface HeaderProps {
  setTheme: React.Dispatch<React.SetStateAction<availableThemes>>;
}

const Header: FC<HeaderProps> = ({ setTheme }) => {
  return (
    <SC.HeaderContainer>
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
    </SC.HeaderContainer>
  );
};

export default Header;
