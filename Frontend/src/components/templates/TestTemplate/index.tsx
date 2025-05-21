import React from "react";
import * as SC from "./styles";
import Button from "@/components/atoms/Button";
import NavigationBar from "@/components/molecules/NavigationBar";
import { Headline } from "@/components/atoms/Headline";

const TestTemplate = () => (
  <SC.Container>
    <Button $variant="primary">Primary </Button>
    <Button $variant="secondary">Secondary </Button>
    <Button $variant="accept">Accept </Button>
    <Button $variant="deny">Deny </Button>
    <br />
    <br />
    <NavigationBar></NavigationBar>
    <br />
    <Headline>This is a Headline</Headline>
    <Headline compact={true}>This is a Headline</Headline>
    <Headline color="secondary">This is a Headline</Headline>
    <Headline weight="bold">This is a Headline</Headline>
  </SC.Container>
);
export default TestTemplate;
