import type React from 'react';
import { useTimerContext } from '../context/TimerContext';

const TimersView: React.FC = () => {
    const { timers, removeTimer, resetWorkout, fastForward, startWorkout, currentTimer } = useTimerContext();

    const renderConfigDetails = (config: any, type: string) => {
        switch (type) {
            case 'countdown':
                return (
                    <div>
                        <p>
                            <strong>Total Time:</strong> {config.totalSeconds}s
                        </p>
                    </div>
                );
            case 'xy':
                return (
                    <div>
                        <p>
                            <strong>Time per Round:</strong> {config.timePerRound}s
                        </p>
                        <p>
                            <strong>Total Rounds:</strong> {config.totalRounds}
                        </p>
                    </div>
                );
            case 'tabata':
                return (
                    <div>
                        <p>
                            <strong>Work Duration:</strong> {config.workSeconds}s
                        </p>
                        <p>
                            <strong>Rest Duration:</strong> {config.restSeconds}s
                        </p>
                        <p>
                            <strong>Total Rounds:</strong> {config.totalRounds}
                        </p>
                    </div>
                );
            case 'stopwatch':
                return (
                    <div>
                        <p>
                            <strong>Total Time:</strong> {config.totalSeconds}s
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>Workout Timers</h2>
            {timers.length === 0 && <p style={{ textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>No timers added. Click "Add Timer" to get started.</p>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {timers.map((timer, index) => (
                    <li
                        key={timer.id}
                        style={{
                            marginBottom: '20px',
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            backgroundColor: '#fff',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#2C4001' }}>
                                    #{index + 1} - {timer.type}
                                </h3>
                                <div style={{ marginTop: '10px' }}>{renderConfigDetails(timer.config, timer.type)}</div>
                            </div>
                            <button
                                onClick={() => removeTimer(timer.id)}
                                style={{
                                    backgroundColor: '#D9420B',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '10px 15px',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Remove
                            </button>
                        </div>
                        <p style={{ marginTop: '10px', fontSize: '1rem', color: '#555' }}>
                            <strong>State:</strong> {timer.state}
                        </p>
                    </li>
                ))}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                <button
                    onClick={startWorkout}
                    disabled={timers.length === 0}
                    style={{
                        backgroundColor: timers.length > 0 ? '#2C4001' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '15px 20px',
                        fontSize: '1.2rem',
                        cursor: timers.length > 0 ? 'pointer' : 'not-allowed',
                    }}
                >
                    Start Workout
                </button>
                <button
                    onClick={resetWorkout}
                    disabled={timers.length === 0}
                    style={{
                        backgroundColor: timers.length > 0 ? '#730202' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '15px 20px',
                        fontSize: '1.2rem',
                        cursor: timers.length > 0 ? 'pointer' : 'not-allowed',
                    }}
                >
                    Reset Workout
                </button>
                <button
                    onClick={fastForward}
                    disabled={!currentTimer || currentTimer.state === 'completed'}
                    style={{
                        backgroundColor: currentTimer && currentTimer.state !== 'completed' ? '#D98F4E' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '15px 20px',
                        fontSize: '1.2rem',
                        cursor: currentTimer && currentTimer.state !== 'completed' ? 'pointer' : 'not-allowed',
                    }}
                >
                    Fast Forward
                </button>
            </div>
        </div>
    );
};

export default TimersView;
