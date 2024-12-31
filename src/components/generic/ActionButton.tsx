import type React from 'react';

interface ActionButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, disabled }) => {
    return (
        <button onClick={onClick} disabled={disabled} style={{ margin: '5px', padding: '10px 15px' }}>
            {label}
        </button>
    );
};

export default ActionButton;
