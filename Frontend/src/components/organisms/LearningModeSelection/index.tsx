import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import LearningMode from "@/components/organisms/LearningMode";
import LearningModeTemplate from "@/components/templates/LearningModeTemplate";

const LearningModeSelection = () => {
  const [startLearning, setStartLearning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (startLearning) {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startLearning]);

  if (startLearning) {
    return <LearningMode elapsedSeconds={elapsedSeconds} />;
  }

  return (
    <LearningModeTemplate>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", marginTop: 64 }}>
        <Button $variant="primary" onClick={() => setStartLearning(true)}>
          Start Learning Mode
        </Button>
        <Button $variant="secondary" onClick={() => router.push("/cards")}>
          Customize Flashcards
        </Button>
      </div>
    </LearningModeTemplate>
  );
};

export default LearningModeSelection;