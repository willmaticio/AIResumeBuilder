
import React, { useState } from 'react';
import { XMarkIcon } from '../icons';

interface TagInputProps {
    label: string;
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ label, tags, onTagsChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', ','].includes(e.key) && inputValue.trim()) {
            e.preventDefault();
            const newTags = [...new Set([...tags, inputValue.trim()])];
            onTagsChange(newTags);
            setInputValue('');
        }
        if (e.key === 'Backspace' && !inputValue) {
            e.preventDefault();
            onTagsChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-muted-text dark:text-gray-400 mb-1">{label}</label>
            <div className="flex flex-wrap items-center w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-lines dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-accent-gold">
                {tags.map(tag => (
                    <span key={tag} className="flex items-center bg-primary-navy text-white text-xs font-semibold mr-2 mb-1 mt-1 px-2.5 py-1 rounded-full dark:bg-accent-gold dark:text-ink">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1.5 text-white/70 hover:text-white dark:text-ink/70 dark:hover:text-ink">
                            <XMarkIcon className="w-3 h-3"/>
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-transparent focus:outline-none min-w-[100px] text-sm py-1"
                    placeholder="Add tags..."
                />
            </div>
        </div>
    );
};
