import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTimerContext } from '../context/TimerContext';
import type { TimerConfig } from '../context/TimerContext';

const EditTimerView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { timers, editTimer } = useTimerContext();

    const [type, setType] = useState<'countdown' | 'stopwatch' | 'xy' | 'tabata'>('countdown');
    const [description, setDescription] = useState<string>('');
    const [config, setConfig] = useState<TimerConfig>({});

    useEffect(() => {
        const timer = timers.find(timer => timer.id === id);
        if (timer) {
            setType(timer.type);
            setDescription(timer.description || '');
            setConfig(timer.config || {});
        }
    }, [id, timers]);

    const handleSave = () => {
        if (!id) return;

        editTimer(id, {
            type,
            description,
            config,
        });

        navigate('/');
    };

    const renderConfigFields = () => {
        switch (type) {
            case 'countdown':
                return (
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Total Seconds:
                            <input
                                type="number"
                                value={config.totalSeconds || ''}
                                onChange={e =>
                                    setConfig(prev => ({
                                        ...prev,
                                        totalSeconds: Number.parseInt(e.target.value, 10) || 0,
                                    }))
                                }
                            />
                        </label>
                    </div>
                );
            case 'xy':
                return (
                    <>
                        <div style={{ marginBottom: '10px' }}>
                            <label>
                                Time Per Round:
                                <input
                                    type="number"
                                    value={config.timePerRound || ''}
                                    onChange={e =>
                                        setConfig(prev => ({
                                            ...prev,
                                            timePerRound: Number.parseInt(e.target.value, 10) || 0,
                                        }))
                                    }
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>
                                Total Rounds:
                                <input
                                    type="number"
                                    value={config.totalRounds || ''}
                                    onChange={e =>
                                        setConfig(prev => ({
                                            ...prev,
                                            totalRounds: Number.parseInt(e.target.value, 10) || 0,
                                        }))
                                    }
                                />
                            </label>
                        </div>
                    </>
                );
            case 'tabata':
                return (
                    <>
                        <div style={{ marginBottom: '10px' }}>
                            <label>
                                Work Seconds:
                                <input
                                    type="number"
                                    value={config.workSeconds || ''}
                                    onChange={e =>
                                        setConfig(prev => ({
                                            ...prev,
                                            workSeconds: Number.parseInt(e.target.value, 10) || 0,
                                        }))
                                    }
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>
                                Rest Seconds:
                                <input
                                    type="number"
                                    value={config.restSeconds || ''}
                                    onChange={e =>
                                        setConfig(prev => ({
                                            ...prev,
                                            restSeconds: Number.parseInt(e.target.value, 10) || 0,
                                        }))
                                    }
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>
                                Total Rounds:
                                <input
                                    type="number"
                                    value={config.totalRounds || ''}
                                    onChange={e =>
                                        setConfig(prev => ({
                                            ...prev,
                                            totalRounds: Number.parseInt(e.target.value, 10) || 0,
                                        }))
                                    }
                                />
                            </label>
                        </div>
                    </>
                );
            case 'stopwatch':
                return (
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            Total Time (Optional):
                            <input
                                type="number"
                                value={config.totalSeconds || ''}
                                onChange={e =>
                                    setConfig(prev => ({
                                        ...prev,
                                        totalSeconds: Number.parseInt(e.target.value, 10) || 0,
                                    }))
                                }
                            />
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Edit Timer</h2>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Type:
                        <select value={type} onChange={e => setType(e.target.value as 'countdown' | 'stopwatch' | 'xy' | 'tabata')}>
                            <option value="countdown">Countdown</option>
                            <option value="stopwatch">Stopwatch</option>
                            <option value="xy">XY</option>
                            <option value="tabata">Tabata</option>
                        </select>
                    </label>
                </div>
                {renderConfigFields()}
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        Description:
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                    </label>
                </div>
                <button type="submit" style={{ marginRight: '10px' }}>
                    Save
                </button>
                <button type="button" onClick={() => navigate('/')}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditTimerView;
