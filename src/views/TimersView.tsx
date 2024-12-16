import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { useTimerContext } from '../context/TimerContext';

const TimersView: React.FC = () => {
    const { timers, reorderTimers, removeTimer } = useTimerContext();
    const navigate = useNavigate();

    // Handle drag-and-drop events
    const handleDragEnd = (result: any) => {
        if (!result.destination) return; // Drop outside the list
        reorderTimers(result.source.index, result.destination.index);
    };

    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>Workout Timers</h2>

            {/* Drag and Drop Context */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="timers">
                    {(provided) => (
                        <ul
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 auto',
                                width: '80%',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                            }}
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
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '10px',
                                                padding: '15px',
                                                backgroundColor: 'white',
                                                border: '1px solid #ddd',
                                                borderRadius: '5px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            }}
                                        >
                                            {/* Timer Details */}
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>
                                                    #{index + 1} - {timer.type}
                                                </h3>
                                                <p style={{ margin: '5px 0 0', color: '#777' }}>
                                                    {timer.description || 'No description provided'}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div>
                                                <button
                                                    onClick={() => navigate(`/edit/${timer.id}`)}
                                                    style={{
                                                        marginRight: '10px',
                                                        padding: '8px 12px',
                                                        backgroundColor: '#007bff',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => removeTimer(timer.id)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        backgroundColor: '#dc3545',
                                                        color: '#fff',
                                                        border: 'none',
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
        </div>
    );
};

export default TimersView;