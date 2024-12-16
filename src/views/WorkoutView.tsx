import React from 'react';
import ActionButton from '../components/generic/ActionButton';
import TimeDisplay from '../components/generic/TimeDisplay';
import { useTimerContext } from '../context/TimerContext';

const WorkoutView: React.FC = () => {
    const {
        currentTimer,
        startWorkout,
        resetWorkout,
        fastForward,
        isWorkoutRunning,
        toggleWorkout,
        timers,
    } = useTimerContext();

    // Helper to render timer details
    const renderTimerDetails = () => {
        if (!currentTimer) {
            return (
                <p style={{ fontSize: '1.2rem', color: '#888', textAlign: 'center' }}>
                    No active timer. Start a workout to begin.
                </p>
            );
        }

        const { type, config, state } = currentTimer;

        return (
            <div
                style={{
                    margin: '20px auto',
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    maxWidth: '400px',
                }}
            >
                <h3 style={{ fontSize: '1.5rem', color: '#2C4001', marginBottom: '10px' }}>
                    Current Timer: {type.charAt(0).toUpperCase() + type.slice(1)}
                </h3>
                <p style={{ fontSize: '1rem', color: '#555' }}>
                    <strong>State:</strong> {state}
                </p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2C4001' }}>
                    {config.totalSeconds ? `${config.totalSeconds} s` : '--'}
                </p>
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#2C4001' }}>Workout in Progress</h2>

            {/* Show "Start Workout" button if timers exist and workout hasn't started */}
            {!currentTimer && timers.length > 0 && (
                <ActionButton
                    label="Start Workout"
                    onClick={startWorkout}
                    disabled={isWorkoutRunning}
                />
            )}

            {/* Render Timer Details */}
            {renderTimerDetails()}

            {/* Render Timer Countdown */}
            {currentTimer?.config?.totalSeconds && (
                <TimeDisplay timeInMs={currentTimer.config.totalSeconds * 1000} />
            )}

            {/* Action Buttons */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
    {!isWorkoutRunning && (
        <ActionButton
            label="Start Workout"
            onClick={startWorkout}
            disabled={currentTimer?.state === 'running' || !currentTimer}
        />
    )}
    {isWorkoutRunning && (
        <ActionButton
            label="Pause Workout"
            onClick={toggleWorkout}
            disabled={!currentTimer}
        />
    )}
    <ActionButton
        label="Reset Workout"
        onClick={resetWorkout}
        disabled={!currentTimer}
    />
    <ActionButton
        label="Fast Forward"
        onClick={fastForward}
        disabled={!currentTimer || currentTimer.state === 'completed'}
    />
</div>

        </div>
    );
};

export default WorkoutView;
