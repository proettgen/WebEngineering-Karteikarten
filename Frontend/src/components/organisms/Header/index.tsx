import { FC } from "react";
import * as SC from "./styles";
import Icon from "@/components/atoms/Icon";
import { HeaderProps } from "./types";
import NavigationBar from "@/components/molecules/NavigationBar";
import Link from "@/components/atoms/Link";
import { Headline } from "@/components/atoms/Headline";

const Header: FC<HeaderProps> = ({ themeName, setTheme }) => {
  return (
    <SC.HeaderWrapper>
      <SC.LogoWrapper>
        <Link href={"/Home"}>
          <Icon size="m" color="textPrimary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="m159-168-34-14q-31-13-41.5-45t3.5-63l72-156v278Zm160 88q-33 0-56.5-23.5T239-160v-240l106 294q3 7 6 13.5t8 12.5h-40Zm206-4q-32 12-62-3t-42-47L243-622q-12-32 2-62.5t46-41.5l302-110q32-12 62 3t42 47l178 488q12 32-2 62.5T827-194L525-84Zm-86-476q17 0 28.5-11.5T479-600q0-17-11.5-28.5T439-640q-17 0-28.5 11.5T399-600q0 17 11.5 28.5T439-560Zm58 400 302-110-178-490-302 110 178 490ZM319-650l302-110-302 110Z" />
            </svg>
          </Icon>
          <Headline size="md" compact={true} weight="bold">
            Flash Card Buddy
          </Headline>
        </Link>
      </SC.LogoWrapper>

      <NavigationBar />
      <Icon
        size="m"
        color="textPrimary"
        onClick={() =>
          setTheme((prev) =>
            prev === "lightTheme" ? "darkTheme" : "lightTheme"
          )
        }
      >
        {themeName === "darkTheme" ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" />
          </svg>
        )}
      </Icon>
    </SC.HeaderWrapper>
  );
};
export default Header;
