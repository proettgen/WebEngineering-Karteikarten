import React, { useState, useEffect, useRef } from "react";
import { storageService } from "../../../services/storageService";
import FolderList from "@/components/molecules/FolderList";
import LearningModeManager from "../LearningModeManager";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import Button from "@/components/atoms/Button";
import { Folder } from "@/database/dbtypes";
import { useRouter } from "next/navigation";

const LearningModeSelection = () => {
  const [step, setStep] = useState<"start" | "select-folder" | "select-box" | "learn">("start");
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
        <h2>Select a box in the flashcard box</h2>
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
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
        </div>
        <Button $variant="secondary" onClick={() => setStep("select-folder")}>
          Zurück
        </Button>
      </LearningModeTemplate>
    );
  }

  if (step === "select-folder") {
    return (
      <LearningModeTemplate>
        <h2>Select a folder</h2>
        <FolderList
          folders={folders}
          showOnlyNames={true}
          onAddCard={() => {}}
          onEditCard={() => {}}
          onDeleteCard={() => {}}
          onFolderClick={(folder) => {
            // Typisiere folder als Folder
            const fullFolder = folders.find((f) => f.id === folder.id) || folders.find((f) => f.name === folder.name);
            setSelectedFolder(fullFolder ?? folder);
            setStep("select-box");
          }}
        />
        <Button $variant="secondary" onClick={() => setStep("start")}>
          Zurück
        </Button>
      </LearningModeTemplate>
    );
  }

  // Schritt "start"
  return (
    <LearningModeTemplate>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", marginTop: 64 }}>
        <Button $variant="primary" onClick={() => setStep("select-folder")}>
          Start Learning Mode
        </Button>
        <Button $variant="secondary" onClick={() => {
          router.push("/cards");
        }}>
          Customize Flashcards before Learning
        </Button>
      </div>
    </LearningModeTemplate>
  );
};

export default LearningModeSelection;