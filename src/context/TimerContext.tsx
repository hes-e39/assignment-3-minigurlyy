import { createContext, useContext, useEffect, useState } from 'react';
import type React from 'react';

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
    editTimer: (id: string, updatedTimer: Partial<Timer>) => void; // Added
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

    const addTimer = (timer: Timer) => {
        setTimers(prev => [...prev, timer]);
    };

    const editTimer = (id: string, updatedTimer: Partial<Timer>) => {
        setTimers(prev => prev.map(timer => (timer.id === id ? { ...timer, ...updatedTimer } : timer)));
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

    const moveToNextTimer = () => {
        setCurrentIndex(prev => {
            const nextIndex = prev + 1;
            if (nextIndex < timers.length) return nextIndex;
            setIsWorkoutRunning(false);
            return -1;
        });
    };

    const completeCurrentTimer = () => {
        setTimers(prev => prev.map((timer, index) => (index === currentIndex ? { ...timer, state: 'completed' } : timer)));
        moveToNextTimer();
    };

    const startWorkout = () => {
        if (timers.length > 0) {
            setCurrentIndex(0); // Set the first timer as the current timer
            setIsWorkoutRunning(true); // Start the workout
            setTimers(prev =>
                prev.map((timer, index) => ({
                    ...timer,
                    state: index === 0 ? 'running' : 'not running', // Mark the first timer as 'running'
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

    const currentTimer = currentIndex >= 0 ? timers[currentIndex] : null;

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isWorkoutRunning && currentTimer) {
            interval = setInterval(() => {
                setTimers(prev =>
                    prev.map((timer, index) => {
                        if (index !== currentIndex || timer.state !== 'running') return timer;

                        const { type, config } = timer;

                        switch (type) {
                            case 'countdown': {
                                const remaining = (config.totalSeconds || 0) - 1;
                                if (remaining <= 0) completeCurrentTimer();
                                return { ...timer, config: { ...config, totalSeconds: remaining > 0 ? remaining : 0 } };
                            }
                            case 'stopwatch': {
                                return { ...timer, config: { ...config, totalSeconds: (config.totalSeconds || 0) + 1 } };
                            }
                            case 'xy': {
                                const remaining = (config.totalSeconds || 0) - 1;
                                if (remaining <= 0) {
                                    const nextRound = (config.currentRound || 1) + 1;
                                    if (nextRound > (config.totalRounds || 1)) {
                                        completeCurrentTimer();
                                    } else {
                                        return {
                                            ...timer,
                                            config: { ...config, totalSeconds: config.timePerRound, currentRound: nextRound },
                                        };
                                    }
                                }
                                return { ...timer, config: { ...config, totalSeconds: remaining } };
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
    }, [isWorkoutRunning, currentIndex, currentTimer]);

    return (
        <TimerContext.Provider
            value={{
                timers,
                addTimer,
                editTimer,
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
    if (!context) throw new Error('useTimerContext must be used within a TimerProvider');
    return context;
};
