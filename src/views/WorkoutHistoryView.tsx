import type React from 'react';
import { useEffect, useState } from 'react';

// Workout Interface
interface Workout {
    id: string;
    date: string; // ISO date string
    totalTime: number;
    timers: string[]; // Array of timer descriptions
}

const WorkoutHistoryView: React.FC = () => {
    const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);

    // Load workout history from local storage on mount
    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('workoutHistory');
            setWorkoutHistory(storedHistory ? JSON.parse(storedHistory) : []);
        } catch (error) {
            console.error('Failed to load workout history:', error);
            setWorkoutHistory([]); // Fallback to an empty array
        }
    }, []);

    // Clear workout history
    const clearHistory = () => {
        localStorage.removeItem('workoutHistory');
        setWorkoutHistory([]);
    };

    // Format date for readability
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>Workout History</h2>

            {workoutHistory.length === 0 ? (
                <p
                    style={{
                        textAlign: 'center',
                        fontSize: '1.2rem',
                        color: '#555',
                        marginBottom: '20px',
                    }}
                >
                    No workout history available. Start a workout to see it here.
                </p>
            ) : (
                <>
                    <button
                        onClick={clearHistory}
                        style={{
                            display: 'block',
                            margin: '0 auto 20px',
                            padding: '10px 20px',
                            fontSize: '1rem',
                            backgroundColor: '#d9534f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Clear History
                    </button>
                    <div
                        style={{
                            maxHeight: '400px', // Limit the height
                            overflowY: 'auto', // Enable scrolling
                            border: '1px solid #ddd',
                            padding: '10px',
                            borderRadius: '8px',
                            backgroundColor: '#f8f9fa',
                        }}
                    >
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {workoutHistory.map(workout => (
                                <li
                                    key={workout.id}
                                    style={{
                                        marginBottom: '20px',
                                        padding: '15px',
                                        border: '1px solid #ddd',
                                        borderRadius: '10px',
                                        backgroundColor: '#fff',
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: '1.5rem',
                                            marginBottom: '10px',
                                            color: '#2C4001',
                                        }}
                                    >
                                        Workout on {formatDate(workout.date)}
                                    </h3>
                                    <p
                                        style={{
                                            marginBottom: '10px',
                                            fontSize: '1.2rem',
                                            color: '#555',
                                        }}
                                    >
                                        <strong>Total Time:</strong> {workout.totalTime} seconds
                                    </p>
                                    <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
                                        {workout.timers.map((timer, index) => (
                                            <li
                                                key={index}
                                                style={{
                                                    fontSize: '1rem',
                                                    color: '#555',
                                                    marginBottom: '5px',
                                                }}
                                            >
                                                {timer}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default WorkoutHistoryView;

// import type React from 'react';
// import { useEffect, useState } from 'react';

// // Workout Interface
// interface Workout {
//     id: string;
//     date: string; // ISO date string
//     totalTime: number;
//     timers: string[]; // Array of timer descriptions
// }

// const WorkoutHistoryView: React.FC = () => {
//     const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);

//     // Load workout history from local storage on mount
//     useEffect(() => {
//         const storedHistory = localStorage.getItem('workoutHistory');
//         setWorkoutHistory(storedHistory ? JSON.parse(storedHistory) : []);
//     }, []);

//     // Clear workout history
//     const clearHistory = () => {
//         localStorage.removeItem('workoutHistory');
//         setWorkoutHistory([]);
//     };

//     // Format date for readability
//     const formatDate = (dateString: string) => {
//         const options: Intl.DateTimeFormatOptions = {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     return (
//         <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
//             <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>Workout History</h2>

//             {workoutHistory.length === 0 ? (
//                 <p
//                     style={{
//                         textAlign: 'center',
//                         fontSize: '1.2rem',
//                         color: '#555',
//                         marginBottom: '20px',
//                     }}
//                 >
//                     No workout history available. Start a workout to see it here.
//                 </p>
//             ) : (
//                 <>
//                     <button
//                         onClick={clearHistory}
//                         style={{
//                             display: 'block',
//                             margin: '0 auto 20px',
//                             padding: '10px 20px',
//                             fontSize: '1rem',
//                             backgroundColor: '#d9534f',
//                             color: '#fff',
//                             border: 'none',
//                             borderRadius: '5px',
//                             cursor: 'pointer',
//                         }}
//                     >
//                         Clear History
//                     </button>
//                     <div
//                         style={{
//                             maxHeight: '400px', // Limit the height
//                             overflowY: 'auto', // Enable scrolling
//                             border: '1px solid #ddd',
//                             padding: '10px',
//                             borderRadius: '8px',
//                             backgroundColor: '#f8f9fa',
//                         }}
//                     >
//                         <ul style={{ listStyle: 'none', padding: 0 }}>
//                             {workoutHistory.map(workout => (
//                                 <li
//                                     key={workout.id}
//                                     style={{
//                                         marginBottom: '20px',
//                                         padding: '15px',
//                                         border: '1px solid #ddd',
//                                         borderRadius: '10px',
//                                         backgroundColor: '#fff',
//                                         boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
//                                     }}
//                                 >
//                                     <h3
//                                         style={{
//                                             fontSize: '1.5rem',
//                                             marginBottom: '10px',
//                                             color: '#2C4001',
//                                         }}
//                                     >
//                                         Workout on {formatDate(workout.date)}
//                                     </h3>
//                                     <p
//                                         style={{
//                                             marginBottom: '10px',
//                                             fontSize: '1.2rem',
//                                             color: '#555',
//                                         }}
//                                     >
//                                         <strong>Total Time:</strong> {workout.totalTime} seconds
//                                     </p>
//                                     <ul style={{ paddingLeft: '20px', marginBottom: 0 }}>
//                                         {workout.timers.map((timer, index) => (
//                                             <li
//                                                 key={index}
//                                                 style={{
//                                                     fontSize: '1rem',
//                                                     color: '#555',
//                                                     marginBottom: '5px',
//                                                 }}
//                                             >
//                                                 {timer}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default WorkoutHistoryView;
