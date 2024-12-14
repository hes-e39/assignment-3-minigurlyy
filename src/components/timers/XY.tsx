import React, { useState, useEffect, useRef } from "react";
import TimerControls from "../TimerControls";

interface XYProps {
  initialTimePerRound: number;
  totalRounds: number;
}

const XY: React.FC<XYProps> = ({ initialTimePerRound, totalRounds }) => {
  const [time, setTime] = useState(initialTimePerRound);
  const [round, setRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setTimeout(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && time === 0) {
      if (round < totalRounds) {
        setTime(initialTimePerRound);
        setRound((prevRound) => prevRound + 1);
      } else {
        setIsRunning(false);
      }
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isRunning, time, round]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTimePerRound);
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

export default XY;
