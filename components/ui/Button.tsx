
import React from 'react';
import { LoadingSpinner } from '../icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'default' | 'icon';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'default',
    isLoading = false,
    className = '',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary-navy text-white hover:bg-opacity-90 dark:bg-accent-gold dark:text-ink dark:hover:bg-opacity-90',
        secondary: 'bg-lines text-ink hover:bg-gray-200 dark:bg-gray-700 dark:text-dark-text dark:hover:bg-gray-600',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-text',
    };

    const sizeClasses = {
        default: 'px-4 py-2 text-sm',
        icon: 'p-2',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button className={classes} disabled={isLoading || props.disabled} {...props}>
            {isLoading && <LoadingSpinner className="w-5 h-5 mr-2" />}
            {children}
        </button>
    );
};
