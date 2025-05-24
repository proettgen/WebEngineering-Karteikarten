import React from "react";
import * as SC from "./styles";

type LearningModeTemplateProps = {
  children: React.ReactNode;
  elapsedSeconds?: number; // optional für Rückwärtskompatibilität
};

const formatTime = (seconds: number) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const LearningModeTemplate = ({ children, elapsedSeconds }: LearningModeTemplateProps) => (
  <SC.Container>
    <SC.Header>
      <SC.Title>Learning Mode</SC.Title>
      {typeof elapsedSeconds === "number" && (
        <SC.Timer>{formatTime(elapsedSeconds)}</SC.Timer>
      )}
    </SC.Header>
    {children}
  </SC.Container>
);

export default LearningModeTemplate;