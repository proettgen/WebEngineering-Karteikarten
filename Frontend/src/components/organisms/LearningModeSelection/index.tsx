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

const LearningModeSelection = () => {
  const [step, setStep] = useState<LearningModeSelectionStep>("start");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const folders: Folder[] = storageService.getData().folders;

  // Timer-Logik: Start/Stop je nach Schritt
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

  // Schritt "start"
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