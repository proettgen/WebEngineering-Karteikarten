// !!! ACHTUNG: Build schlägt fehl, weil Folder aus Storage/Backend nicht alle Felder des Folder-Typs haben.
// Bitte Backend und Datenmodell anpassen, damit Folder dem Typ aus folderTypes.ts entsprechen!

import React, { useState, useEffect, useRef } from "react";
import { storageService } from "../../../services/storageService";
import FolderList from "@/components/molecules/FolderList";
import LearningModeManager from "../LearningModeManager";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import Headline from "@/components/atoms/Headline";
import * as SC from "./styles";
import { LearningModeSelectionStep } from "./types";
import { Folder } from "@/database/dbtypes";

/**
 * LearningModeSelection-Komponente
 *
 * Diese Komponente steuert den gesamten Auswahl- und Navigationsprozess für den Lernmodus:
 * - Schrittweises Vorgehen: Start → Ordnerauswahl → Box-Auswahl → Lernen
 * - Timer-Logik für die Lernzeit
 * - Übergabe der gewählten Parameter an den LearningModeManager
 *
 * State:
 * - step: aktueller Schritt im Auswahlprozess ("start", "select-folder", "select-box", "learn")
 * - selectedFolder: aktuell ausgewählter Ordner
 * - selectedBox: aktuell ausgewählte Box (0-3)
 * - elapsedSeconds: bisher vergangene Zeit im Lernmodus
 * - resetTrigger: erzwingt Remount des LearningModeManagers bei Neustart
 * - timerRef: Referenz auf das Timer-Interval
 *
 * Die Komponente rendert je nach Schritt unterschiedliche UI:
 * - Start: Begrüßung und Start-Button
 * - Ordnerauswahl: Liste aller Ordner
 * - Box-Auswahl: Auswahl der Box (1-4) mit Kartenanzahl
 * - Lernen: Übergabe an LearningModeManager
 */
const LearningModeSelection = () => {
  // Aktueller Schritt im Auswahlprozess (start, select-folder, select-box, learn)
  const [step, setStep] = useState<LearningModeSelectionStep>("start");
  // Ausgewählter Ordner
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  // Ausgewählte Box (0-3)
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  // Bisher vergangene Zeit im Lernmodus (für Timer)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  // Trigger für Remount bei Neustart
  const [resetTrigger, setResetTrigger] = useState(0);
  // Referenz für den Timer-Interval (wird für setInterval genutzt)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Router für Navigation (z.B. zurück zu den Karten)
  const router = useRouter();

  // Alle verfügbaren Ordner aus dem Storage laden
  const folders: Folder[] = storageService.getData().folders;

  /**
   * Timer-Logik: Startet und stoppt den Timer je nach aktuellem Schritt.
   * Setzt die Zeit zurück, wenn der Lernmodus verlassen wird.
   * Der Timer läuft nur während der Box-Auswahl und im Lernmodus selbst.
   */
  useEffect(() => {
    if (step === "select-box" || step === "learn") {
      // Timer nur starten, wenn er nicht schon läuft
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }
    } else {
      // Timer stoppen und zurücksetzen, wenn Folder verlassen wird
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedSeconds(0);
    }
    // Cleanup beim Unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [step]);

  // Schritt: Lernen (LearningModeManager einbinden)
  if (step === "learn" && selectedFolder && selectedBox !== null) {
    return (
      <LearningModeManager
        folder={selectedFolder}
        boxLevel={selectedBox}
        elapsedSeconds={elapsedSeconds}
        onBack={() => {
          // Folder aus Storage neu laden, damit Kartenanzahl aktuell ist
          const freshFolders = storageService.getData().folders;
          const freshFolder = freshFolders.find((f) => f.id === selectedFolder.id);
          setSelectedFolder(freshFolder ?? selectedFolder);
          setStep("select-box");
        }}
        onRestart={() => {
          setSelectedBox(0); // Box 1 (Index 0)
          setElapsedSeconds(0);
          setResetTrigger((t) => t + 1); // erzwinge Remount
        }}
        onBackToFolders={() => {
          setStep("select-folder");
          setElapsedSeconds(0);
        }}
        key={resetTrigger + ":" + selectedFolder.id + ":" + selectedBox}
      />
    );
  }

  // Schritt: Box-Auswahl (zeigt alle Boxen mit Kartenanzahl und Auswahlmöglichkeit)
  if (step === "select-box" && selectedFolder) {
    // Kartenanzahl pro Box berechnen
    const boxCounts = [0, 1, 2, 3].map(
      (box) => selectedFolder.cards.filter((card) => (card.boxLevel ?? 0) === box).length
    );
    return (
      <LearningModeTemplate elapsedSeconds={elapsedSeconds}>
        <SC.CenteredColumn>
          <Headline size="md">Select a box</Headline>
          <SC.BoxButtonRow>
            {[0, 1, 2, 3].map((box) => (
              <Button
                key={box}
                $variant="primary"
                onClick={() => {
                  setSelectedBox(box);
                  setStep("learn");
                }}
              >
                {`Box ${box + 1} (${boxCounts[box]})`}
              </Button>
            ))}
          </SC.BoxButtonRow>
          <Button $variant="secondary" onClick={() => setStep("select-folder")}>
            Back
          </Button>
        </SC.CenteredColumn>
      </LearningModeTemplate>
    );
  }

  // Schritt: Ordnerauswahl (zeigt alle verfügbaren Ordner an)
  if (step === "select-folder") {
    return (
      <LearningModeTemplate>
        <SC.CenteredColumn>
          <Headline size="md">Select a folder</Headline>
          <FolderList
            folders={folders}
            showOnlyNames={true}
            onAddCard={() => {}}
            onEditCard={() => {}}
            onDeleteCard={() => {}}
            onFolderClick={(folder) => {
              // Sucht den vollständigen Ordner anhand der ID oder des Namens
              const fullFolder =
                folders.find((f) => f.id === folder.id) ||
                folders.find((f) => f.name === folder.name);
              setSelectedFolder(fullFolder ?? folder);
              setStep("select-box");
            }}
          />
          <Button $variant="secondary" onClick={() => setStep("start")}>
            Back
          </Button>
        </SC.CenteredColumn>
      </LearningModeTemplate>
    );
  }

  // Schritt: Start (Einstiegsbildschirm mit Start- und Edit-Button)
  return (
    <LearningModeTemplate>
      <SC.CenteredColumn>
        <Button $variant="primary" onClick={() => setStep("select-folder")}>
          Start learning mode
        </Button>
        <Button $variant="secondary" onClick={() => router.push("/cards")}>
          Edit flashcards before learning
        </Button>
      </SC.CenteredColumn>
    </LearningModeTemplate>
  );
};

export default LearningModeSelection;