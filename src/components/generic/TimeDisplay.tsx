import type React from 'react';

interface TimeDisplayProps {
    timeInMs: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeInMs }) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10);

    return (
        <div className="text-center text-3xl font-bold text-gray-700">
            {minutes}:{seconds.toString().padStart(2, '0')}:{milliseconds.toString().padStart(2, '0')}
        </div>
    );
};

export default TimeDisplay;
