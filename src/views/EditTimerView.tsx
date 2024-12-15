import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTimerContext } from '../context/TimerContext';

const EditTimerView: React.FC = () => {
    const { timers, editTimer } = useTimerContext();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [type, setType] = useState<'countdown' | 'xy' | 'tabata' | 'stopwatch'>('countdown');
    const [config, setConfig] = useState<any>({});
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Load timer data for the given ID
    useEffect(() => {
        if (id) {
            const timer = timers.find((t) => t.id === id);
            if (timer) {
                setType(timer.type);
                setConfig(timer.config);
                setDescription(timer.description || '');
            } else {
                setError('Timer not found.');
            }
        } else {
            setError('Invalid timer ID.');
        }
    }, [id, timers]);

    // Handle updating the timer
    const handleUpdateTimer = () => {
        if (!id) {
            setError('Invalid timer ID.');
            return;
        }

        if (
            (type === 'countdown' && !config.totalSeconds) ||
            (type === 'xy' && (!config.timePerRound || !config.totalRounds)) ||
            (type === 'tabata' && (!config.workSeconds || !config.restSeconds || !config.totalRounds)) ||
            (type === 'stopwatch' && !config.totalSeconds)
        ) {
            setError('Please fill in all required fields for the selected timer type.');
            return;
        }

        editTimer(id, {
            type,
            description,
            config,
        });

        navigate('/');
    };

    // Dynamically render input fields based on the timer type
    const renderConfigFields = () => {
        switch (type) {
            case 'countdown':
                return (
                    <input
                        type="number"
                        placeholder="Total Time (seconds)"
                        value={config.totalSeconds || ''}
                        onChange={(e) => setConfig({ totalSeconds: +e.target.value })}
                    />
                );
            case 'xy':
                return (
                    <>
                        <input
                            type="number"
                            placeholder="Time Per Round (seconds)"
                            value={config.timePerRound || ''}
                            onChange={(e) =>
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
                            onChange={(e) =>
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
                            onChange={(e) =>
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
                            onChange={(e) =>
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
                            onChange={(e) =>
                                setConfig((prev: any) => ({
                                    ...prev,
                                    totalRounds: +e.target.value,
                                }))
                            }
                        />
                    </>
                );
            case 'stopwatch':
                return (
                    <input
                        type="number"
                        placeholder="Total Time (seconds)"
                        value={config.totalSeconds || ''}
                        onChange={(e) => setConfig({ totalSeconds: +e.target.value })}
                    />
                );
            default:
                return null;
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="edit-timer-container">
            <h2 className="edit-timer-heading">Edit Timer</h2>
            {error && <div className="error-message">{error}</div>}

            {/* Timer type options */}
            <div className="timer-type-options">
                {(['countdown', 'xy', 'tabata', 'stopwatch'] as const).map((option) => (
                    <button
                        key={option}
                        className={`timer-option-button ${type === option ? 'active' : ''}`}
                        onClick={() => setType(option)}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {/* Input fields */}
            <div className="config-fields">{renderConfigFields()}</div>

            {/* Description field */}
            <textarea
                placeholder="Add a description for this timer (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* Buttons */}
            <div className="button-container">
                <button className="update-button" onClick={handleUpdateTimer}>
                    Update Timer
                </button>
                <button className="back-button" onClick={() => navigate('/')}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default EditTimerView;
