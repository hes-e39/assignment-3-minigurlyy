import type React from 'react';
import ActionButton from '../components/generic/ActionButton';
import RoundDisplay from '../components/generic/RoundDisplay';
import TimeDisplay from '../components/generic/TimeDisplay';
import { useTimerContext } from '../context/TimerContext';

const WorkoutView: React.FC = () => {
    const { currentTimer, startWorkout, resetWorkout, fastForward } = useTimerContext();

    // Helper to render details of the current timer
    const renderTimerDetails = () => {
        if (!currentTimer) {
            return <p style={{ fontSize: '1.2rem', color: '#888', textAlign: 'center' }}>No active timer. Start a workout to begin.</p>;
        }

        const { type, config, state } = currentTimer;

        return (
            <div
                style={{
                    margin: '20px auto',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa',
                    width: '80%',
                }}
            >
                <h3 style={{ fontSize: '1.5rem', textAlign: 'center' }}>Current Timer</h3>
                <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                    <strong>Type:</strong> {type}
                </p>
                <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                    <strong>State:</strong> {state}
                </p>
                <p style={{ fontSize: '1.2rem' }}>
                    <strong>Config:</strong> {JSON.stringify(config)}
                </p>
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Workout in Progress</h2>

            {/* Render Current Timer Details */}
            {renderTimerDetails()}

            {/* Render Timer Countdown or Round Display */}
            {currentTimer?.type === 'xy' && <RoundDisplay currentRound={currentTimer.config.currentRound || 1} totalRounds={currentTimer.config.totalRounds || 1} />}

            {currentTimer?.config?.initialTime && <TimeDisplay timeInMs={currentTimer.config.initialTime * 1000} />}

            {/* Action Buttons */}
            <div style={{ marginTop: '30px' }}>
                <ActionButton label="Start Workout" onClick={startWorkout} disabled={!currentTimer} />
                <ActionButton label="Reset Workout" onClick={resetWorkout} disabled={!currentTimer} />
                <ActionButton label="Fast Forward" onClick={fastForward} disabled={!currentTimer || currentTimer.state === 'completed'} />
            </div>

            {/* Status Messages */}
            {currentTimer?.state === 'completed' && <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#28a745' }}>Timer Completed! Moving to the next one...</p>}

            {!currentTimer && <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#555' }}>No timers available. Please add a timer to start the workout.</p>}
        </div>
    );
};

export default WorkoutView;
