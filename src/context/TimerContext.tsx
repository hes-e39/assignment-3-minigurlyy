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

// Timer Context Properties
interface TimerContextProps {
    timers: Timer[];
    addTimer: (timer: Timer) => void;
    editTimer: (id: string, updatedData: Partial<Timer>) => void;
    removeTimer: (id: string) => void;
    resetWorkout: () => void;
    fastForward: () => void;
    currentTimer: Timer | null;
    startWorkout: () => void;
    isWorkoutRunning: boolean;
    toggleWorkout: () => void;
    reorderTimers: (startIndex: number, endIndex: number) => void;
    completeWorkout: () => void;
}

// Create TimerContext
const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timers, setTimers] = useState<Timer[]>(() => {
        const storedTimers = localStorage.getItem('timers');
        return storedTimers ? JSON.parse(storedTimers) : [];
    });

    const [currentIndex, setCurrentIndex] = useState<number>(() => {
        const storedIndex = localStorage.getItem('currentIndex');
        return storedIndex ? parseInt(storedIndex, 10) : -1;
    });

    const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

    useEffect(() => {
        localStorage.setItem('timers', JSON.stringify(timers));
        localStorage.setItem('currentIndex', currentIndex.toString());
    }, [timers, currentIndex]);

    // Request notification permission when the app loads
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Function to send notifications
    const sendNotification = (title: string, body: string) => {
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        }
    };

    const addTimer = (timer: Timer) => setTimers((prev) => [...prev, timer]);

    const removeTimer = (id: string) => setTimers((prev) => prev.filter((timer) => timer.id !== id));

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
            sendNotification('Timer Fast Forwarded', 'The current timer was fast-forwarded.');
            setTimers((prev) =>
                prev.map((timer, index) =>
                    index === currentIndex
                        ? { ...timer, state: 'completed' }
                        : timer,
                ),
            );
            const nextIndex = currentIndex + 1;
            if (nextIndex < timers.length) {
                setCurrentIndex(nextIndex);
            } else {
                completeWorkout();
            }
        }
    };

    const startWorkout = () => {
        if (timers.length > 0) {
            setCurrentIndex(0);
            setIsWorkoutRunning(true);
            sendNotification('Workout Started', 'The workout has started!');
            setTimers((prev) =>
                prev.map((timer, index) => ({
                    ...timer,
                    state: index === 0 ? 'running' : 'not running',
                })),
            );
        }
    };

    const completeWorkout = () => {
        sendNotification('Workout Complete', 'Congratulations! You have completed your workout.');
        resetWorkout();
    };

    const toggleWorkout = () => setIsWorkoutRunning((prev) => !prev);

    const reorderTimers = (startIndex: number, endIndex: number) => {
        setTimers((prev) => {
            const updatedTimers = Array.from(prev);
            const [removed] = updatedTimers.splice(startIndex, 1);
            updatedTimers.splice(endIndex, 0, removed);
            return updatedTimers;
        });
    };

    const currentTimer =
        currentIndex >= 0 && currentIndex < timers.length ? timers[currentIndex] : null;

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
                reorderTimers,
                completeWorkout,
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
