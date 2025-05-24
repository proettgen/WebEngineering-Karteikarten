import React, { useState } from "react";
import { storageService } from "../../../services/storageService";
import FolderList from "@/components/molecules/FolderList";
import LearningMode from "@/components/organisms/LearningMode";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";
import Button from "@/components/atoms/Button";

const LearningModeSelection = () => {
  const [step, setStep] = useState<"start" | "select-folder" | "learn">("start");
  const [selectedFolderCards, setSelectedFolderCards] = useState<any[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const folders = storageService.getData().folders;

  if (step === "learn") {
    return (
      <LearningMode
        elapsedSeconds={elapsedSeconds}
        cards={selectedFolderCards}
      />
    );
  }

  if (step === "select-folder") {
    return (
      <LearningModeTemplate>
        <h2>Wähle einen Ordner</h2>
        <FolderList
          folders={folders}
          showOnlyNames={true}
          onAddCard={() => {}}
          onEditCard={() => {}}
          onDeleteCard={() => {}}
          onFolderClick={(folder) => {
            setSelectedFolderCards(folder.cards);
            setStep("learn");
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
        <Button $variant="secondary" onClick={() => {/* ... */}}>
          Customize Flashcards
        </Button>
      </div>
    </LearningModeTemplate>
  );
};

export default LearningModeSelection;