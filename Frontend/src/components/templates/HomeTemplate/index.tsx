import * as SC from "./styles";
import { Headline } from "@/components/atoms/Headline";
import { Text } from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import Link from "@/components/atoms/Link";

const HomeTemplate = () => (
  <>
    <SC.SectionWrapper>
      <Headline size="xl" color="textPrimary">
        The easiest way to create and study flashcards
      </Headline>
      <Text size="medium">
        Welcome to your personal flashcard companion! Our app makes learning faster
        and more effective with custom flashcards tailored to your needs.
      </Text>
      <Text size="medium">
        Enjoy a distraction-free interface, intuitive card flipping, and seamless
        studying—anytime, anywhere.
      </Text>
    </SC.SectionWrapper>
    <SC.LoginWrapper>
      <Link href={"/login"}>
        <Button>
          <Text size="medium">Login</Text>
        </Button>
      </Link>
      <Text color="textPrimary" size="medium">
        or
      </Text>
      <Link href={"/signup"}>
        <Button $variant="secondary">
          <Text size="medium">Register</Text>
        </Button>
      </Link>
    </SC.LoginWrapper>
    <SC.SectionWrapper>
      <Headline size="xl" color="textPrimary">
        Getting started is simple
      </Headline>
      <>
        <Text size="medium">New here? </Text>
        <Link href={"/signup"} color="secondary">
          Create your free account now!
        </Link>
      </>
      <Text size="medium">
        Build your own decks in just a few clicks and start mastering new topics
        right away.
      </Text>
    </SC.SectionWrapper>
  </>
);
export default HomeTemplate;
