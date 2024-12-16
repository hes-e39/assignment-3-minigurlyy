import React, { useState, useEffect, useRef } from "react";
import TimerControls from "../TimerControls";

interface TabataProps {
  workDuration: number;
  restDuration: number;
  totalRounds: number;
}

const Tabata: React.FC<TabataProps> = ({ workDuration, restDuration, totalRounds }) => {
  const [time, setTime] = useState(workDuration);
  const [isWorkPeriod, setIsWorkPeriod] = useState(true);
  const [round, setRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setTimeout(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && time === 0) {
      if (isWorkPeriod) {
        setIsWorkPeriod(false);
        setTime(restDuration);
      } else {
        setIsWorkPeriod(true);
        setRound((prevRound) => prevRound + 1);
        setTime(workDuration);

        if (round >= totalRounds) {
          setIsRunning(false);
        }
      }
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isRunning, time, isWorkPeriod, round]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(workDuration);
    setIsWorkPeriod(true);
    setRound(1);
  };
  const handleFastForward = () => {
    setIsRunning(false);
    setTime(0);
    setRound(totalRounds);
  };

  return (
    <div>
      <div className="timer-round">Round {round}/{totalRounds}</div>
      <h2>{isWorkPeriod ? "Work" : "Rest"}</h2>
      <div className="timer-time">
        {Math.floor(time / 60).toString().padStart(2, "0")}:
        {(time % 60).toString().padStart(2, "0")}
      </div>
      <TimerControls
        isRunning={isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onFastForward={handleFastForward}
      />
    </div>
  );
};

export default Tabata;
