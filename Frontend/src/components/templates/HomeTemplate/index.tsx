import * as SC from "./styles";
import { Headline } from "@/components/atoms/Headline";
import { Text } from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import Link from "@/components/atoms/Link";

const HomeTemplate = () => (
  <>
    <SC.SectionWrapper>
      <Headline size="xl" color="textPrimary">
        The easy way to make and study flashcards
      </Headline>
      <Text size="medium">
        A fun and simple app to help you learn faster with custom flashcards.
        Create your own decks in seconds and start reviewing right away.
      </Text>
      <Text size="medium">
        Stay focused with a clean interface, smart card flipping, and seamless
        studying — wherever you are.
      </Text>
    </SC.SectionWrapper>
    <SC.LoginWrapper>
      <Link href={"/login"}>
        <Button>
          <Text size="medium">
            Login
          </Text>
        </Button>
      </Link>
      <Text color="textPrimary" size="medium">
        or
      </Text>
      <Link href={"/cards"}>
        <Button $variant="secondary">
          <Text size="medium">
            Guest
          </Text>
        </Button>
      </Link>
    </SC.LoginWrapper>
    <SC.SectionWrapper>
      <Headline size="xl" color="textPrimary">
        Getting started is easy
      </Headline>
      <>
        <Text size="medium">
          Dont have an account yet?{" "}
        </Text>
        <Link href={"/signup"} color="secondary">
          Register here!
        </Link>
      </>
      <Text size="medium" >
        Create your own decks in seconds and start reviewing right away.
      </Text>
    </SC.SectionWrapper>
  </>
);
export default HomeTemplate;
