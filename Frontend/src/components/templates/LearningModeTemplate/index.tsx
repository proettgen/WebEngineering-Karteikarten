import React, { useMemo } from "react";
import * as SC from "./styles";
import Headline from "@/components/atoms/Headline";
import { LearningModeTemplateProps } from "./types";
/**
 * Template-Komponente für den Lernmodus (Layout-Wrapper).
 *
 * Diese Komponente stellt das Layout für den Lernmodus bereit:
 * - Kopfzeile mit Titel, Timer und Box-Anzeige
 * - Container für die jeweiligen Inhalte (children)
 *
 * Props:
 * - children: Die eigentlichen Inhalte (z.B. Auswahl, Karte, Buttons)
 * - elapsedSeconds: Bisher vergangene Zeit im Lernmodus (optional, für Timer-Anzeige)
 * - currentLearningLevel: Aktuelles Lernlevel/Box-Stufe (optional, für Anzeige)
 * - boxCount: Anzahl der Karten in der aktuellen Box (optional)
 *
 * Diese Komponente enthält keine eigene Logik, sondern dient nur als Layout-Wrapper für die Inhalte.
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