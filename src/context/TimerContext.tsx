import { createContext, useContext, useEffect, useState } from 'react';
import type React from 'react';
import Countdown from '../components/timers/Countdown';
import Stopwatch from '../components/timers/Stopwatch';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';

// Timer Configuration Interface
export interface TimerConfig {
    initialTime?: number;
    currentRound?: number;
    totalRounds?: number;
    workSeconds?: number;
    restSeconds?: number;
    totalSeconds?: number;
    timePerRound?: number;
}

// Timer Interface
export interface Timer {
    id: string;
    type: 'countdown' | 'stopwatch' | 'xy' | 'tabata';
    description?: string;
    config: TimerConfig;
    state: 'not running' | 'running' | 'completed';
}

interface TimerContextProps {
    timers: Timer[];
    addTimer: (timer: Timer) => void;
    removeTimer: (id: string) => void;
    resetWorkout: () => void;
    fastForward: () => void;
    currentTimer: Timer | null;
    startWorkout: () => void;
    isWorkoutRunning: boolean;
    toggleWorkout: () => void;
    completeCurrentTimer: () => void;
    reorderTimers: (startIndex: number, endIndex: number) => void;
    editTimer: (id: string, updatedTimer: Partial<Timer>) => void;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timers, setTimers] = useState<Timer[]>(() => {
        const savedTimers = localStorage.getItem('timers');
        return savedTimers ? JSON.parse(savedTimers) : [];
    });
    const [currentIndex, setCurrentIndex] = useState<number>(() => {
        const savedIndex = localStorage.getItem('currentIndex');
        return savedIndex ? Number.parseInt(savedIndex, 10) : -1;
    });
    const [isWorkoutRunning, setIsWorkoutRunning] = useState<boolean>(() => {
        const savedIsRunning = localStorage.getItem('isWorkoutRunning');
        return savedIsRunning ? JSON.parse(savedIsRunning) : false;
    });

    const [workoutHistory, setWorkoutHistory] = useState(() => {
        const savedHistory = localStorage.getItem('workoutHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    useEffect(() => {
        localStorage.setItem('timers', JSON.stringify(timers));
        localStorage.setItem('currentIndex', currentIndex.toString());
        localStorage.setItem('isWorkoutRunning', JSON.stringify(isWorkoutRunning));
        localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    }, [timers, currentIndex, isWorkoutRunning, workoutHistory]);

    const addTimer = (timer: Timer) => {
        setTimers(prev => [...prev, timer]);
    };

    const removeTimer = (id: string) => {
        setTimers(prev => prev.filter(timer => timer.id !== id));
    };

    const resetWorkout = () => {
        setTimers(prev =>
            prev.map(timer => ({
                ...timer,
                state: 'not running',
                config: {
                    ...timer.config,
                    totalSeconds: timer.config.initialTime || 0,
                    currentRound: 1,
                },
            })),
        );
        setCurrentIndex(-1);
        setIsWorkoutRunning(false);
    };

    const saveWorkoutToHistory = () => {
        const totalTime = timers.reduce((sum, timer) => sum + (timer.config.totalSeconds || 0), 0);
        const workoutEntry = {
            id: `workout-${Date.now()}`,
            date: new Date().toISOString(),
            totalTime,
            timers: timers.map(timer => timer.description || `${timer.type} Timer`),
        };
        setWorkoutHistory((prev: typeof workoutHistory) => [...prev, workoutEntry]); // Explicitly typing 'prev'
    };

    const moveToNextTimer = () => {
        setCurrentIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < timers.length) {
                setTimers(prevTimers =>
                    prevTimers.map((timer, index) => ({
                        ...timer,
                        state: index === nextIndex ? 'running' : timer.state,
                    })),
                );
                return nextIndex;
            }
            setIsWorkoutRunning(false);
            saveWorkoutToHistory(); // Save workout to history when all timers are completed
            return -1;
        });
    };

    const completeCurrentTimer = () => {
        setTimers(prevTimers => prevTimers.map((timer, index) => (index === currentIndex ? { ...timer, state: 'completed' } : timer)));
        moveToNextTimer();
    };

    const startWorkout = () => {
        if (timers.length > 0) {
            setCurrentIndex(0);
            setIsWorkoutRunning(true);
            setTimers(prevTimers =>
                prevTimers.map((timer, index) => ({
                    ...timer,
                    state: index === 0 ? 'running' : 'not running',
                })),
            );
        }
    };

    const toggleWorkout = () => setIsWorkoutRunning(prev => !prev);

    const fastForward = () => completeCurrentTimer();

    const reorderTimers = (startIndex: number, endIndex: number) => {
        setTimers(prev => {
            const updatedTimers = Array.from(prev);
            const [removed] = updatedTimers.splice(startIndex, 1);
            updatedTimers.splice(endIndex, 0, removed);
            return updatedTimers;
        });
    };

    const editTimer = (id: string, updatedTimer: Partial<Timer>) => {
        setTimers(prev => prev.map(timer => (timer.id === id ? { ...timer, ...updatedTimer } : timer)));
    };

    const currentTimer = currentIndex >= 0 && currentIndex < timers.length ? timers[currentIndex] : null;

    return (
        <TimerContext.Provider
            value={{
                timers,
                addTimer,
                removeTimer,
                resetWorkout,
                fastForward,
                currentTimer,
                startWorkout,
                isWorkoutRunning,
                toggleWorkout,
                completeCurrentTimer,
                reorderTimers,
                editTimer,
            }}
        >
            {children}
            {currentTimer?.type === 'countdown' && currentTimer.config.totalSeconds !== undefined && <Countdown initialTime={currentTimer.config.totalSeconds} onComplete={completeCurrentTimer} />}
            {currentTimer?.type === 'xy' && currentTimer.config.timePerRound !== undefined && currentTimer.config.totalRounds !== undefined && (
                <XY initialTimePerRound={currentTimer.config.timePerRound} totalRounds={currentTimer.config.totalRounds} onComplete={completeCurrentTimer} />
            )}
            {currentTimer?.type === 'tabata' && currentTimer.config.workSeconds !== undefined && currentTimer.config.restSeconds !== undefined && currentTimer.config.totalRounds !== undefined && (
                <Tabata workDuration={currentTimer.config.workSeconds} restDuration={currentTimer.config.restSeconds} totalRounds={currentTimer.config.totalRounds} onComplete={completeCurrentTimer} />
            )}
            {currentTimer?.type === 'stopwatch' && <Stopwatch time={currentTimer.config.totalSeconds || 0} onComplete={completeCurrentTimer} />}
        </TimerContext.Provider>
    );
};

export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimerContext must be used within a TimerProvider');
    }
    return context;
};
