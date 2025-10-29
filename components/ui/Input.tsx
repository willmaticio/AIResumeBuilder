
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-muted-text dark:text-gray-400 mb-1">{label}</label>
            <input
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-lines dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold"
                {...props}
            />
        </div>
    );
};
