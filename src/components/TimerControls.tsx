import type React from 'react';

interface TimerControlsProps {
    isRunning: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onFastForward: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({ isRunning, onStart, onPause, onReset, onFastForward }) => {
    return (
        <div>
            <button onClick={onStart} disabled={isRunning} className="timer-button start-button">
                Start
            </button>
            <button onClick={onPause} disabled={!isRunning} className="timer-button pause-button">
                Pause
            </button>
            <button onClick={onReset} className="timer-button reset-button">
                Reset
            </button>
            <button onClick={onFastForward} className="timer-button fast-forward-button">
                Fast Forward
            </button>
        </div>
    );
};

export default TimerControls;
