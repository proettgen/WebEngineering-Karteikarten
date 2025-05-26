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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const folders: Folder[] = storageService.getData().folders;

  // Timer-Logik: Start/Stop je nach Schritt
  useEffect(() => {
    if (step === "learn") {
      setElapsedSeconds(0); // Reset beim Start
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
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
        onBack={() => setStep("select-box")}
      />
    );
  }

  if (step === "select-box" && selectedFolder) {
    return (
      <LearningModeTemplate>
        <SC.CenteredColumn>
          <Headline size="md">Wähle eine Box</Headline>
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
                {`Box ${box + 1}`}
              </Button>
            ))}
          </SC.BoxButtonRow>
          <Button $variant="secondary" onClick={() => setStep("select-folder")}>
            Zurück
          </Button>
        </SC.CenteredColumn>
      </LearningModeTemplate>
    );
  }

  if (step === "select-folder") {
    return (
      <LearningModeTemplate>
        <SC.CenteredColumn>
          <Headline size="md">Wähle einen Ordner</Headline>
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
            Zurück
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
          Learning Mode starten
        </Button>
        <Button $variant="secondary" onClick={() => router.push("/cards")}>
          Karteikarten vor dem Lernen anpassen
        </Button>
      </SC.CenteredColumn>
    </LearningModeTemplate>
  );
};

export default LearningModeSelection;