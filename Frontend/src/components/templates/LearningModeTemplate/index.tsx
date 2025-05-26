import React from "react";
import * as SC from "./styles";
import Headline from "@/components/atoms/Headline";
import { LearningModeTemplateProps } from "./types";

/**
 * Template-Komponente für den Lernmodus.
 * Stellt das Layout, die Kopfzeile mit Timer und Box-Anzeige sowie einen Container für die jeweiligen Inhalte bereit.
 *
 * Props:
 * - children: Die eigentlichen Inhalte (z.B. Karte, Auswahl, Buttons)
 * - elapsedSeconds: Bisher vergangene Zeit im Lernmodus (optional)
 * - boxLevel: Aktuelle Box-Stufe (optional, für Anzeige)
 * - boxCount: Anzahl der Karten in der aktuellen Box (optional)
 */
const formatTime = (seconds: number) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const LearningModeTemplate = ({ children, elapsedSeconds, boxLevel, boxCount }: LearningModeTemplateProps & { boxLevel?: number; boxCount?: number }) => (
  <SC.Container>
    <SC.Header>
      <Headline size="md">Learning Mode</Headline>
      {/* Anzeige der aktuellen Box und Kartenanzahl */}
      {typeof boxLevel === "number" && (
        <SC.BoxLevel>
          {`Box ${boxLevel + 1}${typeof boxCount === "number" ? ` (${boxCount})` : ""}`}
        </SC.BoxLevel>
      )}
      {/* Timer-Anzeige */}
      {typeof elapsedSeconds === "number" && (
        <SC.TimerRow>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
            aria-label="Uhr"
          >
            <path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z" />
          </svg>
          <SC.Timer>{formatTime(elapsedSeconds)}</SC.Timer>
        </SC.TimerRow>
      )}
    </SC.Header>
    {/* Platz für die eigentlichen Inhalte */}
    {children}
  </SC.Container>
);

export default LearningModeTemplate;