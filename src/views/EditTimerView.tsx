import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTimerContext } from '../context/TimerContext';

const EditTimerView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { timers, editTimer } = useTimerContext();

    const [type, setType] = useState<'countdown' | 'stopwatch' | 'xy' | 'tabata'>('countdown');
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        const timer = timers.find(timer => timer.id === id);
        if (timer) {
            setType(timer.type);
            setDescription(timer.description || '');
        }
    }, [id, timers]);

    const handleSave = () => {
        if (!id) return;

        editTimer(id, {
            type,
            description,
        });

        navigate('/');
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
