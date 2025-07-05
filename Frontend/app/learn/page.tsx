/**
 * Einstiegspunkt für die Lernmodus-Seite (/learn).
 *
 * Diese Datei ist die Page-Komponente für Next.js und wird beim Aufruf von /learn geladen.
 * Sie bindet den Organism LearningModeSelection ein, der die gesamte Seitenlogik für den Lernmodus kapselt.
 *
 * Die eigentliche Logik (Navigation, Auswahl, Timer, API) steckt in LearningModeSelection.
 * Die Page-Komponente selbst ist sehr schlank und dient nur als Einstiegspunkt.
 */
"use client";
import React from "react";
import LearningModeSelection from "@/components/organisms/LearningModeSelection";

const LearningModePage = () => <LearningModeSelection />;

export default LearningModePage;
