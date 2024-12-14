import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface TimerConfig {
    initialTime?: number; // For countdown and stopwatch timers
    currentRound?: number; // For XY and Tabata timers
    totalRounds?: number; // For XY and Tabata timers
    workSeconds?: number; // For Tabata timers
    restSeconds?: number; // For Tabata timers
    totalSeconds?: number; // Current remaining time for countdown
}

export interface Timer {
    id: string;
    type: 'countdown' | 'stopwatch' | 'xy' | 'tabata'; // Timer types
    config: TimerConfig;
    state: 'not running' | 'running' | 'completed'; // Timer states
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
        if (currentIndex >= timers.length - 1) {
            setCurrentIndex(timers.length - 2);
        }
    };

    // Reset all timers to 'not running'
    const resetWorkout = () => {
        setTimers(prev => prev.map(timer => ({ ...timer, state: 'not running' })));
        setCurrentIndex(-1);
        setIsWorkoutRunning(false);
    };

    // Move to the next timer in the list
    const moveToNextTimer = () => {
        setCurrentIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < timers.length) {
                setTimers(prev =>
                    prev.map((timer, index) => ({
                        ...timer,
                        state: index === nextIndex ? 'running' : timer.state,
                    })),
                );
                return nextIndex;
            } else {
                setIsWorkoutRunning(false); // End workout if no more timers
                return -1;
            }
        });
    };

    // Complete the current timer and move to the next
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
                    state: index === 0 ? 'running' : timer.state,
                })),
            );
        }
    };

    // Toggle workout running state
    const toggleWorkout = () => {
        if (timers.length > 0) {
            setIsWorkoutRunning(prev => !prev);
        }
    };

    // Fast-forward the current timer
    const fastForward = () => {
        if (currentIndex >= 0 && currentIndex < timers.length) {
            completeCurrentTimer();
        }
    };

    // Current timer based on index
    const currentTimer = currentIndex >= 0 && currentIndex < timers.length ? timers[currentIndex] : null;

    // Handle countdown timers
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isWorkoutRunning && currentTimer) {
            interval = setInterval(() => {
                setTimers(prev =>
                    prev.map((timer, index) => {
                        if (index === currentIndex && timer.state === 'running' && timer.config.totalSeconds) {
                            const remainingTime = (timer.config.totalSeconds || 0) - 1;
                            if (remainingTime <= 0) {
                                completeCurrentTimer();
                            }
                            return {
                                ...timer,
                                config: {
                                    ...timer.config,
                                    totalSeconds: remainingTime > 0 ? remainingTime : 0,
                                },
                            };
                        }
                        return timer;
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
                removeTimer,
                resetWorkout,
                fastForward,
                currentTimer,
                startWorkout,
                isWorkoutRunning,
                toggleWorkout,
                completeCurrentTimer,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

// Custom hook to use TimerContext
export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimerContext must be used within a TimerProvider');
    }
    return context;
};
