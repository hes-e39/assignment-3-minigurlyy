import type React from 'react';

interface RoundDisplayProps {
    currentRound: number;
    totalRounds: number;
    phase?: 'Work' | 'Rest';
}

const RoundDisplay: React.FC<RoundDisplayProps> = ({ currentRound, totalRounds, phase }) => {
    return (
        <div className="text-center mt-2">
            <p className="text-lg font-semibold text-gray-800">
                Round {currentRound} of {totalRounds}
            </p>
            {phase && <p className="text-sm text-gray-600">Phase: {phase}</p>}
        </div>
    );
};

export default RoundDisplay;
