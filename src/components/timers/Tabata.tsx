import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import TimerControls from '../TimerControls';

interface TabataProps {
    workDuration: number; // Work duration in seconds
    restDuration: number; // Rest duration in seconds
    totalRounds: number; // Total number of rounds
    onComplete: () => void; // Callback when Tabata completes
}

const Tabata: React.FC<TabataProps> = ({ workDuration, restDuration, totalRounds, onComplete }) => {
    const [time, setTime] = useState(workDuration); // Remaining time for the current phase
    const [isWorkPeriod, setIsWorkPeriod] = useState(true); // Tracks if it's a "work" or "rest" period
    const [round, setRound] = useState(1); // Tracks the current round
    const [isRunning, setIsRunning] = useState(false); // Controls timer running state
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning && time > 0) {
            intervalRef.current = setTimeout(() => setTime(time - 1), 1000);
        } else if (isRunning && time === 0) {
            transitionPhase();
        }

        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, [isRunning, time]);

    const transitionPhase = () => {
        if (isWorkPeriod) {
            // Transition to Rest
            setIsWorkPeriod(false);
            setTime(restDuration);
        } else {
            // Transition to Work or Next Round
            if (round < totalRounds) {
                setRound(round + 1);
                setIsWorkPeriod(true);
                setTime(workDuration);
            } else {
                // All rounds complete
                setIsRunning(false);
                onComplete(); // Notify the context
            }
        }
    };

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleReset = () => {
        setIsRunning(false);
        setTime(workDuration);
        setIsWorkPeriod(true);
        setRound(1);
    };
    const handleFastForward = () => {
        if (isWorkPeriod) {
            setTime(0); // Skip Work period
        } else {
            transitionPhase(); // Skip Rest and move to next phase
        }
    };

    return (
        <div>
            <div className="tabata-round">
                Round {round}/{totalRounds} - {isWorkPeriod ? 'Work' : 'Rest'}
            </div>
            <div className="timer-time">
                {Math.floor(time / 60)
                    .toString()
                    .padStart(2, '0')}
                :{(time % 60).toString().padStart(2, '0')}
            </div>
            <TimerControls isRunning={isRunning} onStart={handleStart} onPause={handlePause} onReset={handleReset} onFastForward={handleFastForward} />
        </div>
    );
};

export default Tabata;
