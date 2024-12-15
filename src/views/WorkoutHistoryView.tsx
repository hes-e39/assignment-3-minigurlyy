import React, { useEffect, useState } from 'react';

interface Workout {
    id: string;
    date: string;
    totalTime: number;
    timers: string[]; // Array of timer descriptions
}

const WorkoutHistoryView: React.FC = () => {
    const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);

    // Load workout history from local storage
    useEffect(() => {
        const storedHistory = localStorage.getItem('workoutHistory');
        setWorkoutHistory(storedHistory ? JSON.parse(storedHistory) : []);
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>
                Workout History
            </h2>

            {workoutHistory.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>
                    No workout history available.
                </p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {workoutHistory.map((workout) => (
                        <li
                            key={workout.id}
                            style={{
                                marginBottom: '20px',
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '10px',
                                backgroundColor: '#f8f9fa',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
                                Workout on {workout.date}
                            </h3>
                            <p style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
                                <strong>Total Time:</strong> {workout.totalTime} seconds
                            </p>
                            <ul>
                                {workout.timers.map((timer, index) => (
                                    <li key={index} style={{ fontSize: '1rem', color: '#555' }}>
                                        {timer}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WorkoutHistoryView;
