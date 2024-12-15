import React, { createContext, useContext, useEffect, useState } from 'react';

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

export interface Workout {
    id: string;
    date: string;
    totalTime: number;
    timers: string[];
}

// Timer Context Properties
interface TimerContextProps {
    timers: Timer[];
    workoutHistory: Workout[];
    addTimer: (timer: Timer) => void;
    editTimer: (id: string, updatedData: Partial<Timer>) => void;
    removeTimer: (id: string) => void;
    resetWorkout: () => void;
    fastForward: () => void;
    currentTimer: Timer | null;
    startWorkout: () => void;
    isWorkoutRunning: boolean;
    toggleWorkout: () => void;
    completeWorkout: () => void;
    reorderTimers: (startIndex: number, endIndex: number) => void;
}

// Create TimerContext
const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timers, setTimers] = useState<Timer[]>(() => {
        const storedTimers = localStorage.getItem('timers');
        return storedTimers ? JSON.parse(storedTimers) : [];
    });

    const [workoutHistory, setWorkoutHistory] = useState<Workout[]>(() => {
        const storedHistory = localStorage.getItem('workoutHistory');
        return storedHistory ? JSON.parse(storedHistory) : [];
    });

    const [currentIndex, setCurrentIndex] = useState<number>(() => {
        const storedIndex = localStorage.getItem('currentIndex');
        return storedIndex ? parseInt(storedIndex, 10) : -1;
    });

    const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

    useEffect(() => {
        localStorage.setItem('timers', JSON.stringify(timers));
        localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
        localStorage.setItem('currentIndex', currentIndex.toString());
    }, [timers, workoutHistory, currentIndex]);

    const addTimer = (timer: Timer) => setTimers((prev) => [...prev, timer]);

    const removeTimer = (id: string) => {
        setTimers((prev) => prev.filter((timer) => timer.id !== id));
    };

    const editTimer = (id: string, updatedData: Partial<Timer>) => {
        setTimers((prev) =>
            prev.map((timer) => (timer.id === id ? { ...timer, ...updatedData } : timer)),
        );
    };

    const resetWorkout = () => {
        setTimers((prev) =>
            prev.map((timer) => ({
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

    const fastForward = () => {
        if (currentIndex >= 0 && currentIndex < timers.length) {
            setTimers((prev) =>
                prev.map((timer, index) =>
                    index === currentIndex ? { ...timer, state: 'completed' } : timer,
                ),
            );
            moveToNextTimer();
        }
    };

    const moveToNextTimer = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < timers.length) {
            setCurrentIndex(nextIndex);
        } else {
            completeWorkout();
        }
    };

    const startWorkout = () => {
        if (timers.length > 0) {
            setCurrentIndex(0);
            setIsWorkoutRunning(true);
            setTimers((prev) =>
                prev.map((timer, index) => ({
                    ...timer,
                    state: index === 0 ? 'running' : 'not running',
                })),
            );
        }
    };

    const toggleWorkout = () => setIsWorkoutRunning((prev) => !prev);

    const completeWorkout = () => {
        const totalTime = timers.reduce((total, timer) => {
            switch (timer.type) {
                case 'countdown':
                case 'stopwatch':
                    return total + (timer.config.totalSeconds || 0);
                case 'xy':
                    return (
                        total +
                        (timer.config.timePerRound || 0) * (timer.config.totalRounds || 1)
                    );
                case 'tabata':
                    const workTime =
                        (timer.config.workSeconds || 0) * (timer.config.totalRounds || 0);
                    const restTime =
                        (timer.config.restSeconds || 0) * (timer.config.totalRounds || 0);
                    return total + workTime + restTime;
                default:
                    return total;
            }
        }, 0);

        const completedWorkout: Workout = {
            id: `workout-${Date.now()}`,
            date: new Date().toLocaleString(),
            totalTime,
            timers: timers.map((timer) => timer.description || timer.type),
        };

        setWorkoutHistory((prev) => [...prev, completedWorkout]);
        localStorage.setItem('workoutHistory', JSON.stringify([...workoutHistory, completedWorkout]));
        resetWorkout();
    };

    const currentTimer =
        currentIndex >= 0 && currentIndex < timers.length ? timers[currentIndex] : null;

    const reorderTimers = (startIndex: number, endIndex: number) => {
        setTimers((prev) => {
            const updatedTimers = Array.from(prev);
            const [removed] = updatedTimers.splice(startIndex, 1);
            updatedTimers.splice(endIndex, 0, removed);
            return updatedTimers;
        });
    };

    return (
        <TimerContext.Provider
            value={{
                timers,
                workoutHistory,
                addTimer,
                editTimer,
                removeTimer,
                resetWorkout,
                fastForward,
                currentTimer,
                startWorkout,
                isWorkoutRunning,
                toggleWorkout,
                completeWorkout,
                reorderTimers,
            }}
        >
            {children}
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
