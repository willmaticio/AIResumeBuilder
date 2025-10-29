
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-surface dark:bg-gray-800 p-6 rounded-2xl border border-lines dark:border-gray-700 shadow-sm ${className}`}>
            {children}
        </div>
    );
};
