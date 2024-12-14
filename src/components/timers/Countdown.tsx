import React, { useState, useEffect, useRef } from "react";
import TimerControls from "../TimerControls";

interface CountdownProps {
  initialTime: number;
}

const Countdown: React.FC<CountdownProps> = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setTimeout(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isRunning, time]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };
  const handleFastForward = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div>
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

export default Countdown;
