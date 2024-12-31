import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import TimerControls from '../TimerControls';

interface StopwatchProps {
    time: number; // Initial time passed from TimerContext
    onComplete: () => void; // Callback when the stopwatch should complete
}

const Stopwatch: React.FC<StopwatchProps> = ({ time, onComplete }) => {
    const [currentTime, setCurrentTime] = useState(time); // Local time state
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(prevTime => prevTime + 1); // Increment the time
            }, 1000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleReset = () => {
        setIsRunning(false);
        setCurrentTime(time); // Reset to the initial time
    };
    const handleFastForward = () => {
        setIsRunning(false);
        onComplete(); // Notify TimerContext to complete the timer
    };

    return (
        <div>
            <div className="timer-time">
                {Math.floor(currentTime / 60)
                    .toString()
                    .padStart(2, '0')}
                :{(currentTime % 60).toString().padStart(2, '0')}
            </div>
            <TimerControls isRunning={isRunning} onStart={handleStart} onPause={handlePause} onReset={handleReset} onFastForward={handleFastForward} />
        </div>
    );
};

export default Stopwatch;
