import React from "react";
import * as SC from "./styles";

type LearningModeTemplateProps = {
  children: React.ReactNode;
};

const LearningModeTemplate = ({ children }: LearningModeTemplateProps) => (
  <SC.Container>
    <SC.Header>
      <SC.Title>Learning Mode</SC.Title>
    </SC.Header>
    {children}
  </SC.Container>
);

export default LearningModeTemplate;