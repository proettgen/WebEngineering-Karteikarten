import * as SC from "./styles";
import Link from "@/components/atoms/Link";
import Icon from "@/components/atoms/Icon";

function Footer() {
  return (
    <SC.FooterContainer>
      ´
      <Link href={"https://github.com/proettgen/WebEngineering-Karteikarten"}>
        <SC.FooterItem>
          <Icon size="m" color="textPrimary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
            </svg>
          </Icon>{" "}
          <div>Github</div>
        </SC.FooterItem>
      </Link>
    </SC.FooterContainer>
  );
}

export default Footer;
