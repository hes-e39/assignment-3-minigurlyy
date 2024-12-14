import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimerContext } from '../context/TimerContext';

const AddTimerView: React.FC = () => {
    const { addTimer } = useTimerContext();
    const navigate = useNavigate();

    // State to manage timer type and configuration
    const [type, setType] = useState<'countdown' | 'xy' | 'tabata' | 'stopwatch'>('countdown');
    const [config, setConfig] = useState<any>({});
    const [error, setError] = useState<string | null>(null);

    // Validate and handle adding a new timer
    const handleAddTimer = () => {
        if (
            (type === 'countdown' && !config.totalSeconds) ||
            (type === 'xy' && (!config.timePerRound || !config.totalRounds)) ||
            (type === 'tabata' && (!config.workSeconds || !config.restSeconds || !config.totalRounds)) ||
            (type === 'stopwatch' && !config.totalSeconds)
        ) {
            setError('Please fill in all required fields for the selected timer type.');
            return;
        }

        const newTimer = {
            id: `${type}-${Date.now()}`,
            type,
            config,
            state: 'not running' as const,
        };

        addTimer(newTimer);
        navigate('/');
    };

    // Dynamically render input fields based on the timer type
    const renderConfigFields = () => {
        switch (type) {
            case 'countdown':
                return <input type="number" placeholder="Total Time (seconds)" value={config.totalSeconds || ''} onChange={e => setConfig({ totalSeconds: +e.target.value })} />;
            case 'xy':
                return (
                    <>
                        <input
                            type="number"
                            placeholder="Time Per Round (seconds)"
                            value={config.timePerRound || ''}
                            onChange={e =>
                                setConfig((prev: any) => ({
                                    ...prev,
                                    timePerRound: +e.target.value,
                                }))
                            }
                        />
                        <input
                            type="number"
                            placeholder="Total Rounds"
                            value={config.totalRounds || ''}
                            onChange={e =>
                                setConfig((prev: any) => ({
                                    ...prev,
                                    totalRounds: +e.target.value,
                                }))
                            }
                        />
                    </>
                );
            case 'tabata':
                return (
                    <>
                        <input
                            type="number"
                            placeholder="Work Duration (seconds)"
                            value={config.workSeconds || ''}
                            onChange={e =>
                                setConfig((prev: any) => ({
                                    ...prev,
                                    workSeconds: +e.target.value,
                                }))
                            }
                        />
                        <input
                            type="number"
                            placeholder="Rest Duration (seconds)"
                            value={config.restSeconds || ''}
                            onChange={e =>
                                setConfig((prev: any) => ({
                                    ...prev,
                                    restSeconds: +e.target.value,
                                }))
                            }
                        />
                        <input
                            type="number"
                            placeholder="Total Rounds"
                            value={config.totalRounds || ''}
                            onChange={e =>
                                setConfig((prev: any) => ({
                                    ...prev,
                                    totalRounds: +e.target.value,
                                }))
                            }
                        />
                    </>
                );
            case 'stopwatch':
                return <input type="number" placeholder="Total Time (seconds)" value={config.totalSeconds || ''} onChange={e => setConfig({ totalSeconds: +e.target.value })} />;
            default:
                return null;
        }
    };

    return (
        <div className="add-timer-container">
            <h2 className="add-timer-heading">Add Timer</h2>
            {error && <div className="error-message">{error}</div>}

            {/* Timer type options */}
            <div className="timer-type-options">
                {(['countdown', 'xy', 'tabata', 'stopwatch'] as const).map(option => (
                    <button
                        key={option}
                        className={`timer-option-button ${type === option ? 'active' : ''}`}
                        onClick={() => {
                            setType(option);
                            setConfig({});
                            setError(null);
                        }}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {/* Input fields */}
            <div className="config-fields">{renderConfigFields()}</div>

            {/* Buttons */}
            <div className="button-container">
                <button className="add-button" onClick={handleAddTimer}>
                    Add Timer
                </button>
                <button className="back-button" onClick={() => navigate('/')}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default AddTimerView;
