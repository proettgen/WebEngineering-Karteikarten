import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import LearningMode from "@/components/organisms/LearningMode";

const LearningModeSelection = () => {
  const [startLearning, setStartLearning] = useState(false);
  const router = useRouter();

  if (startLearning) {
    return <LearningMode />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", marginTop: 64 }}>
      <Button $variant="primary" onClick={() => setStartLearning(true)}>
        Start Learning Mode
      </Button>
      <Button $variant="secondary" onClick={() => router.push("/cards")}>
        Customize Flashcards
      </Button>
    </div>
  );
};

export default LearningModeSelection;