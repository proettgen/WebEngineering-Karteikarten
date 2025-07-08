import React, { useMemo } from "react";
import * as SC from "./styles";
import Headline from "@/components/atoms/Headline";
import { LearningModeTemplateProps } from "./types";

/**
 * Legacy LearningModeTemplate (Layout-Wrapper).
 *
 * This is the legacy template component used by LearningModeManager and LearningMode.
 * For the main learning mode page, use the modernized template from index_modern.tsx.
 *
 * This component provides layout for the learning mode:
 * - Header with title, timer and box display
 * - Container for the respective content (children)
 *
 * Props:
 * - children: The actual content (e.g. selection, card, buttons)
 * - elapsedSeconds: Time elapsed in learning mode (optional, for timer display)
 * - currentLearningLevel: Current learning level/box level (optional, for display)
 * - boxCount: Number of cards in the current box (optional)
 *
 * This component contains no logic of its own, but only serves as a layout wrapper for the content.
 */
const formatTime = (seconds: number) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const LearningModeTemplate = React.memo(({ children, elapsedSeconds, currentLearningLevel, boxCount }: LearningModeTemplateProps & { currentLearningLevel?: number; boxCount?: number }) => {
  // Memoize formatted time
  const formattedTime = useMemo(() => 
    typeof elapsedSeconds === "number" ? formatTime(elapsedSeconds) : null
  , [elapsedSeconds]);

  // Memoize box level text
  const boxLevelText = useMemo(() => {
    if (typeof currentLearningLevel === "number") {
      return `Box ${currentLearningLevel + 1}${typeof boxCount === "number" ? ` (${boxCount})` : ""}`;
    }
    return null;
  }, [currentLearningLevel, boxCount]);

  return (
    <SC.Container>
      <SC.Header>
        <Headline size="md">Learning Mode</Headline>
        {boxLevelText && (
          <SC.BoxLevel>
            {boxLevelText}
          </SC.BoxLevel>
        )}
        {formattedTime && (
          <SC.TimerRow>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
              aria-label="Clock"
            >
              <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
            </svg>
            <SC.Timer>{formattedTime}</SC.Timer>
          </SC.TimerRow>
        )}
      </SC.Header>
      {children}
    </SC.Container>
  );
});

LearningModeTemplate.displayName = 'LearningModeTemplate';

export default LearningModeTemplate;