// Diese Datei ist der Einstiegspunkt für die Lernmodus-Seite.
// Sie bindet die LearningModeSelection-Komponente ein, die den gesamten Auswahl- und Lernprozess steuert.
"use client";
import React from "react";
// import LearningModeSelection from "@/components/organisms/LearningModeSelection";

// const LearningModePage = () => <LearningModeSelection />;
const LearningModePage = () => (
    <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Learning mode is temporarily disabled.</h2>
        <p>This feature is currently under maintenance.</p>
    </div>
);

export default LearningModePage;
