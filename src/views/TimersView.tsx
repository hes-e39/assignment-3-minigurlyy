import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTimerContext } from '../context/TimerContext';

const TimersView: React.FC = () => {
    const { timers, reorderTimers } = useTimerContext();

    // Handle drag-and-drop events
    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const startIndex = result.source.index;
        const endIndex = result.destination.index;
        reorderTimers(startIndex, endIndex);
    };

    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>Workout Timers</h2>

            {/* List of Timers with Drag-and-Drop */}
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
                                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                                                #{index + 1} - {timer.type}
                                            </h3>
                                            <p>{timer.description || 'No description provided'}</p>
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
