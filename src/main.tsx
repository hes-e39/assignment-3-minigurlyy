import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

// Timer Configuration Interface
export interface TimerConfig {
    initialTime?: number; // For countdown and stopwatch timers
    currentRound?: number; // For XY and Tabata timers
    totalRounds?: number; // For XY and Tabata timers
    workSeconds?: number; // For Tabata timers
    restSeconds?: number; // For Tabata timers
    totalSeconds?: number; // Current remaining time for countdown timers
    timePerRound?: number; // For XY timers - time duration per round
}

// Timer Interface
export interface Timer {
    id: string;
    type: 'countdown' | 'stopwatch' | 'xy' | 'tabata';
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
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

    // Add a new timer
    const addTimer = (timer: Timer) => {
        setTimers(prev => [...prev, timer]);
    };

    // Remove a timer by ID
    const removeTimer = (id: string) => {
        setTimers(prev => prev.filter(timer => timer.id !== id));
    };

    // Reset all timers
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

    // Move to the next timer
    const moveToNextTimer = () => {
        setCurrentIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < timers.length) {
                setTimers(prev =>
                    prev.map((timer, index) => ({
                        ...timer,
                        state: index === nextIndex ? 'running' : 'not running',
                    })),
                );
                return nextIndex;
            } else {
                setIsWorkoutRunning(false);
                return -1; // End workout
            }
        });
    };

    // Complete the current timer
    const completeCurrentTimer = () => {
        if (currentIndex >= 0 && currentIndex < timers.length) {
            setTimers(prev => prev.map((timer, index) => (index === currentIndex ? { ...timer, state: 'completed' } : timer)));
            moveToNextTimer();
        }
    };

    // Start the workout
    const startWorkout = () => {
        if (timers.length > 0) {
            setCurrentIndex(0);
            setIsWorkoutRunning(true);
            setTimers(prev =>
                prev.map((timer, index) => ({
                    ...timer,
                    state: index === 0 ? 'running' : 'not running',
                })),
            );
        }
    };

    // Toggle workout pause/resume
    const toggleWorkout = () => {
        setIsWorkoutRunning(prev => !prev);
    };

    // Fast-forward the current timer
    const fastForward = () => {
        completeCurrentTimer();
    };

    // Reorder timers
    const reorderTimers = (startIndex: number, endIndex: number) => {
        setTimers(prev => {
            const updatedTimers = Array.from(prev);
            const [removed] = updatedTimers.splice(startIndex, 1);
            updatedTimers.splice(endIndex, 0, removed);
            return updatedTimers;
        });
    };

    // Timer logic for countdown, stopwatch, and XY
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isWorkoutRunning && currentIndex >= 0 && currentIndex < timers.length) {
            interval = setInterval(() => {
                setTimers(prev =>
                    prev.map((timer, index) => {
                        if (index !== currentIndex || timer.state !== 'running') return timer;

                        switch (timer.type) {
                            case 'countdown': {
                                const remainingTime = (timer.config.totalSeconds || 0) - 1;
                                if (remainingTime <= 0) completeCurrentTimer();
                                return {
                                    ...timer,
                                    config: { ...timer.config, totalSeconds: remainingTime > 0 ? remainingTime : 0 },
                                };
                            }
                            case 'stopwatch': {
                                const elapsedTime = (timer.config.totalSeconds || 0) + 1;
                                return { ...timer, config: { ...timer.config, totalSeconds: elapsedTime } };
                            }
                            case 'xy': {
                                const updatedTime = (timer.config.totalSeconds || 0) - 1;
                                if (updatedTime <= 0) {
                                    const nextRound = (timer.config.currentRound || 1) + 1;
                                    if (nextRound > (timer.config.totalRounds || 1)) {
                                        completeCurrentTimer();
                                    } else {
                                        return {
                                            ...timer,
                                            config: {
                                                ...timer.config,
                                                totalSeconds: timer.config.timePerRound,
                                                currentRound: nextRound,
                                            },
                                        };
                                    }
                                }
                                return { ...timer, config: { ...timer.config, totalSeconds: updatedTime } };
                            }
                            default:
                                return timer;
                        }
                    }),
                );
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isWorkoutRunning, currentIndex, timers]);

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
