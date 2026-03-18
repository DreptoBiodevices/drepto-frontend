import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
    className?: string;
    label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
    className = '',
    label = 'Back'
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleBack}
            className={`flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium ${className}`}
            aria-label="Go back to previous page"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>{label}</span>
        </button>
    );
};

export default BackButton;
