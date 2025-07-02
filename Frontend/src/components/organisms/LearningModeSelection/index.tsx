import React, { useState, useEffect, useRef } from "react";
import { cardAndFolderService } from "@/services/cardAndFolderService";
import FolderList from "@/components/molecules/FolderList";
import LearningModeManager from "../LearningModeManager";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import Headline from "@/components/atoms/Headline";
import * as SC from "./styles";
import { LearningModeSelectionStep } from "./types";
import { Folder } from "@/database/folderTypes";

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
  // Alle States und Effects müssen immer auf oberster Ebene stehen!
  const [step, setStep] = useState<LearningModeSelectionStep>("start");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Box-Auswahl-States (werden nur genutzt, wenn step === "select-box")
  const [boxCounts, setBoxCounts] = useState([0, 0, 0, 0]);
  const [loadingCards, setLoadingCards] = useState(false);

  // Ordner vom Backend laden
  useEffect(() => {
    setLoadingFolders(true);
    cardAndFolderService
      .getFolders()
      .then((res: any) => {
        setFolders(res.data.folders || []);
        setError(null);
      })
      .catch(() => {
        setError("Fehler beim Laden der Ordner");
      })
      .finally(() => setLoadingFolders(false));
  }, []);

  // Box-Counts laden, wenn ein Folder für die Box-Auswahl gewählt wurde
  useEffect(() => {
    if (step === "select-box" && selectedFolder) {
      setLoadingCards(true);
      cardAndFolderService
        .getCardsByFolder(selectedFolder.id)
        .then((res: any) => {
          const cards = res.data.cards || [];
          const counts = [0, 1, 2, 3].map(
            (box) =>
              cards.filter((card: any) => (card.boxLevel ?? 0) === box).length,
          );
          setBoxCounts(counts);
        })
        .finally(() => setLoadingCards(false));
    }
  }, [step, selectedFolder]);

  // Timer-Logik
  useEffect(() => {
    if (step === "select-box" || step === "learn") {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedSeconds(0);
    }
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
          setStep("select-box");
        }}
        onRestart={() => {
          setSelectedBox(0);
          setElapsedSeconds(0);
          setResetTrigger((t) => t + 1);
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
    return (
      <LearningModeTemplate elapsedSeconds={elapsedSeconds}>
        <SC.CenteredColumn>
          <Headline size="md">Select a box</Headline>
          {loadingCards ? (
            <p>Loading cards ...</p>
          ) : (
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
          )}
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
          {loadingFolders ? (
            <p>Ordner werden geladen ...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <FolderList
              folders={folders.map((f) => ({
                name: f.name,
                id: f.id,
                cards: [],
              }))}
              showOnlyNames={true}
              onAddCard={() => {}}
              onEditCard={() => {}}
              onDeleteCard={() => {}}
              onFolderClick={(folder) => {
                const fullFolder =
                  folders.find((f) => f.id === folder.id) || folder;
                setSelectedFolder(fullFolder);
                setStep("select-box");
              }}
            />
          )}
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
