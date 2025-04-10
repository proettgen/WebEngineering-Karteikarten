import * as SC from "./styles";
import { Headline } from "@/components/atoms/Headline";
import { Text } from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import Link from "@/components/atoms/Link";

function HomeTemplate() {
  return (
    <>
      <SC.SectionWrapper>
        <Headline size="xl" color="textPrimary">
          The easy way to make and study flashcards
        </Headline>
        <Text size="medium" color="textPrimary">
          A fun and simple app to help you learn faster with custom flashcards.
          Create your own decks in seconds and start reviewing right away.
        </Text>
        <Text size="medium" color="textPrimary">
          Stay focused with a clean interface, smart card flipping, and seamless
          studying — wherever you are.
        </Text>
      </SC.SectionWrapper>
      <SC.LoginWrapper>
        <Button disabled={true}>
          <Text size="medium" color="background">
            Login
          </Text>
        </Button>
        <Text color="background">or</Text>
        <Link href={"/cards"}>
          <Button $variant="secondary">
            <Text size="medium" color="background">
              Guest
            </Text>
          </Button>
        </Link>
      </SC.LoginWrapper>
      <SC.SectionWrapper>
        <Headline size="xl" color="textPrimary">
          Getting started is easy
        </Headline>
        <div>
          <Text size="medium" color="textPrimary">
            Dont have an account yet?{" "}
          </Text>
          <Link href={"/Register"} color="secondary">
            Register here!
          </Link>
        </div>
        <Text size="medium" color="textPrimary">
          Create your own decks in seconds and start reviewing right away.
        </Text>
      </SC.SectionWrapper>
    </>
  );
}

export default HomeTemplate;
