import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { useTimerContext } from '../context/TimerContext';

const TimersView: React.FC = () => {
    const { timers, reorderTimers, removeTimer } = useTimerContext();
    const navigate = useNavigate();

    // Handle drag-and-drop events
    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const startIndex = result.source.index;
        const endIndex = result.destination.index;
        reorderTimers(startIndex, endIndex);
    };

    // Navigate to Edit Timer
    const handleEditTimer = (id: string) => {
        navigate(`/edit/${id}`);
    };

    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>Workout Timers</h2>

            {timers.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>
                    No timers added. Click "Add Timer" to get started.
                </p>
            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="timers">
                        {(provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ listStyle: 'none', padding: 0 }}
                            >
                                {timers.map((timer, index) => (
                                    <Draggable key={timer.id} draggableId={timer.id} index={index}>
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    marginBottom: '10px',
                                                    padding: '15px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '10px',
                                                    backgroundColor: '#fff',
                                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                                }}
                                            >
                                                {/* Timer Information */}
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>
                                                        #{index + 1} - {timer.type}
                                                    </h3>
                                                    <p style={{ color: '#555' }}>
                                                        {timer.description || 'No description provided'}
                                                    </p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div style={{ marginTop: '10px' }}>
                                                    <button
                                                        onClick={() => handleEditTimer(timer.id)}
                                                        style={{
                                                            marginRight: '10px',
                                                            backgroundColor: '#007bff',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '8px 12px',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => removeTimer(timer.id)}
                                                        style={{
                                                            backgroundColor: '#dc3545',
                                                            color: '#fff',
                                                            border: 'none',
                                                            padding: '8px 12px',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </div>
    );
};

export default TimersView;
