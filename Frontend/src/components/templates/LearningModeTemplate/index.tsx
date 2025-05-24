import React from "react";
import * as SC from "./styles";

type LearningModeTemplateProps = {
  children: React.ReactNode;
};

const LearningModeTemplate = ({ children }: LearningModeTemplateProps) => (
  <SC.Container>
    <SC.Title>Lernmodus</SC.Title>
    {children}
  </SC.Container>
);

export default LearningModeTemplate;