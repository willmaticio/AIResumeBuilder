
import React, { useRef } from 'react';
import { ResumeData } from '../types';
import { Button } from './ui/Button';
import { DocumentArrowDownIcon, DocumentArrowUpIcon, DocumentPlusIcon, MoonIcon, SunIcon, DocumentTextIcon } from './icons';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    exportJSON: () => void;
    importJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resetState: () => void;
    resumeData: ResumeData;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, exportJSON, importJSON, resetState, resumeData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const exportPDF = () => {
        const element = document.getElementById('resume-preview');
        if (!element) return;

        const opt = {
            margin:       0.5,
            filename:     `Resume_${resumeData.name.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        // @ts-ignore - html2pdf is globally available from CDN
        html2pdf().from(element).set(opt).save();
    };
    
    return (
        <header className="fixed top-0 left-0 right-0 bg-surface/80 dark:bg-dark-bg/80 backdrop-blur-sm border-b border-lines dark:border-gray-800 h-16 flex items-center justify-between px-4 md:px-8 z-10">
            <div className="flex items-center space-x-2">
                <DocumentTextIcon className="w-7 h-7 text-primary-navy dark:text-accent-gold" />
                <h1 className="text-xl font-serif font-bold text-ink dark:text-dark-text">AI Resume Builder</h1>
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={resetState} title="New Resume">
                    <DocumentPlusIcon className="w-5 h-5" />
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/json"
                    onChange={importJSON}
                />
                <Button variant="ghost" size="icon" onClick={handleImportClick} title="Import JSON">
                    <DocumentArrowUpIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={exportJSON} title="Export JSON">
                    <DocumentArrowDownIcon className="w-5 h-5" />
                </Button>
                <Button variant="primary" onClick={exportPDF}>
                    Export PDF
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle Theme">
                    {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                </Button>
            </div>
        </header>
    );
};
