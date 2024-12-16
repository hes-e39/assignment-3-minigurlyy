import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTimerContext } from '../context/TimerContext';

const EditTimerView: React.FC = () => {
    const { timers, editTimer } = useTimerContext();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [type, setType] = useState<'countdown' | 'xy' | 'tabata' | 'stopwatch'>('countdown');
    const [config, setConfig] = useState<any>({});
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        const timer = timers.find(t => t.id === id);
        if (timer) {
            setType(timer.type);
            setConfig(timer.config);
            setDescription(timer.description || '');
        }
    }, [id, timers]);

    const handleUpdate = () => {
        if (id) {
            editTimer(id, { type, config, description });
            navigate('/');
        }
    };

    const renderConfigFields = () => {
        switch (type) {
            case 'countdown':
                return (
                    <input
                        type="number"
                        placeholder="Total Time (seconds)"
                        value={config.totalSeconds || ''}
                        onChange={e => setConfig({ ...config, totalSeconds: +e.target.value })}
                        style={inputStyle}
                    />
                );
            case 'xy':
                return (
                    <>
                        <input
                            type="number"
                            placeholder="Time Per Round (seconds)"
                            value={config.timePerRound || ''}
                            onChange={e => setConfig({ ...config, timePerRound: +e.target.value })}
                            style={inputStyle}
                        />
                        <input type="number" placeholder="Total Rounds" value={config.totalRounds || ''} onChange={e => setConfig({ ...config, totalRounds: +e.target.value })} style={inputStyle} />
                    </>
                );
            case 'tabata':
                return (
                    <>
                        <input
                            type="number"
                            placeholder="Work Duration (seconds)"
                            value={config.workSeconds || ''}
                            onChange={e => setConfig({ ...config, workSeconds: +e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="number"
                            placeholder="Rest Duration (seconds)"
                            value={config.restSeconds || ''}
                            onChange={e => setConfig({ ...config, restSeconds: +e.target.value })}
                            style={inputStyle}
                        />
                        <input type="number" placeholder="Total Rounds" value={config.totalRounds || ''} onChange={e => setConfig({ ...config, totalRounds: +e.target.value })} style={inputStyle} />
                    </>
                );
            case 'stopwatch':
                return (
                    <input
                        type="number"
                        placeholder="Total Time (seconds)"
                        value={config.totalSeconds || ''}
                        onChange={e => setConfig({ ...config, totalSeconds: +e.target.value })}
                        style={inputStyle}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Edit Timer</h2>

            {/* Type Selection Buttons */}
            <div style={buttonContainerStyle}>
                {['countdown', 'xy', 'tabata', 'stopwatch'].map(option => (
                    <button
                        key={option}
                        onClick={() => setType(option as any)}
                        style={{
                            ...buttonStyle,
                            backgroundColor: type === option ? '#556B2F' : '#E0E0E0',
                            color: type === option ? '#FFF' : '#333',
                        }}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>

            {/* Input Fields */}
            <div style={formStyle}>{renderConfigFields()}</div>

            {/* Description */}
            <textarea placeholder="Add a description for this timer (optional)" value={description} onChange={e => setDescription(e.target.value)} style={textareaStyle} />

            {/* Action Buttons */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={handleUpdate} style={updateButtonStyle}>
                    Update Timer
                </button>
                <button onClick={() => navigate('/')} style={backButtonStyle}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default EditTimerView;

/* Styling */
const containerStyle = {
    padding: '20px',
    textAlign: 'center' as const,
};

const headingStyle = {
    fontSize: '2rem',
    marginBottom: '20px',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
};

const buttonStyle = {
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
};

const updateButtonStyle = {
    backgroundColor: '#556B2F',
    color: '#FFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '1.2rem',
    cursor: 'pointer',
};

const backButtonStyle = {
    backgroundColor: '#8B0000',
    color: '#FFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '1.2rem',
    marginLeft: '10px',
    cursor: 'pointer',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
};

const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '300px',
};

const textareaStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '300px',
    height: '80px',
    marginTop: '10px',
};
