
import React, { useState, useRef, useEffect } from 'react';
import type { ResumeData, Template } from '../types';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from './icons';

interface ResumePreviewProps {
    resumeData: ResumeData;
    template: Template;
    onFieldChange: (path: string, value: any) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, template, onFieldChange }) => {
    return (
        <div id="resume-preview" className="bg-surface dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-lg text-sm text-body-text dark:text-gray-300 print:shadow-none print:p-0">
            {template === 'professional' ? (
                <ProfessionalTemplate resumeData={resumeData} onFieldChange={onFieldChange} />
            ) : (
                <ModernTemplate resumeData={resumeData} onFieldChange={onFieldChange} />
            )}
        </div>
    );
};

interface EditableFieldProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    tag?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'li';
    isTextarea?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onChange, className, tag = 'div', isTextarea = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);
    
    const handleBlur = () => {
        setIsEditing(false);
        onChange(currentValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isTextarea) {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setCurrentValue(value);
        }
    };

    if (isEditing) {
        const commonProps = {
            ref: inputRef as any,
            value: currentValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCurrentValue(e.target.value),
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            className: `bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-accent-gold p-0 m-0 ${className}`
        };
        return isTextarea ? <textarea {...commonProps} rows={4} /> : <input {...commonProps} />;
    }
    
    const Tag = tag;
    return <Tag onClick={() => setIsEditing(true)} className={`cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-sm transition-colors ${className}`}>{value || '...'}</Tag>;
};

interface TemplateProps {
    resumeData: ResumeData;
    onFieldChange: (path: string, value: any) => void;
}

const ProfessionalTemplate: React.FC<TemplateProps> = ({ resumeData, onFieldChange }) => (
    <div className="font-serif">
        <header className="text-center border-b-2 border-gray-200 dark:border-gray-600 pb-4 mb-6">
            <EditableField tag="h1" value={resumeData.name} onChange={v => onFieldChange('name', v)} className="text-4xl font-bold text-ink dark:text-white" />
            <EditableField tag="p" value={resumeData.targetRole} onChange={v => onFieldChange('targetRole', v)} className="text-lg text-muted-text dark:text-gray-400 mt-1" />
            <div className="flex justify-center items-center space-x-4 mt-3 text-xs text-muted-text dark:text-gray-400 font-sans">
                <div className="flex items-center space-x-1.5"><EnvelopeIcon className="w-3 h-3"/><EditableField value={resumeData.contact.email} onChange={v => onFieldChange('contact.email', v)} /></div>
                <div className="flex items-center space-x-1.5"><PhoneIcon className="w-3 h-3"/><EditableField value={resumeData.contact.phone} onChange={v => onFieldChange('contact.phone', v)} /></div>
                <div className="flex items-center space-x-1.5"><MapPinIcon className="w-3 h-3"/><EditableField value={resumeData.contact.location} onChange={v => onFieldChange('contact.location', v)} /></div>
            </div>
        </header>

        <section>
            <h2 className="text-xl font-bold text-ink dark:text-white mb-2 uppercase tracking-wider">Skills</h2>
            <div className="font-sans text-sm text-body-text dark:text-gray-300">
                <EditableField value={resumeData.skills.join(', ')} onChange={v => onFieldChange('skills', v.split(',').map(s => s.trim()))} />
            </div>
        </section>

        <section className="mt-6">
            <h2 className="text-xl font-bold text-ink dark:text-white mb-2 uppercase tracking-wider">Experience</h2>
            <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="page-break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold text-ink dark:text-white">
                                <EditableField value={exp.jobTitle} onChange={v => onFieldChange(`experience.${index}.jobTitle`, v)} className="inline"/>
                                <span className="text-muted-text dark:text-gray-400 font-normal"> at </span>
                                <EditableField value={exp.company} onChange={v => onFieldChange(`experience.${index}.company`, v)} className="inline"/>
                            </h3>
                            <div className="text-sm text-muted-text dark:text-gray-400 font-sans">
                                <EditableField value={exp.startDate} onChange={v => onFieldChange(`experience.${index}.startDate`, v)} className="inline"/> - <EditableField value={exp.endDate} onChange={v => onFieldChange(`experience.${index}.endDate`, v)} className="inline"/>
                            </div>
                        </div>
                        <EditableField value={exp.location} onChange={v => onFieldChange(`experience.${index}.location`, v)} className="text-sm text-muted-text dark:text-gray-400 font-sans mb-2"/>
                        <ul className="list-disc pl-5 mt-1 space-y-1 font-sans text-body-text dark:text-gray-300">
                            {exp.bullets.map((bullet, bIndex) => (
                                <li key={bIndex}>
                                    <EditableField tag="li" value={bullet} onChange={v => onFieldChange(`experience.${index}.bullets.${bIndex}`, v)} className="inline-block" />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>

        <section className="mt-6">
            <h2 className="text-xl font-bold text-ink dark:text-white mb-2 uppercase tracking-wider">Education</h2>
            <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                     <div key={edu.id} className="page-break-inside-avoid">
                        <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-bold text-ink dark:text-white">
                                <EditableField value={edu.institution} onChange={v => onFieldChange(`education.${index}.institution`, v)} className="inline"/>
                            </h3>
                            <div className="text-sm text-muted-text dark:text-gray-400 font-sans">
                                <EditableField value={edu.startDate} onChange={v => onFieldChange(`education.${index}.startDate`, v)} className="inline"/> - <EditableField value={edu.endDate} onChange={v => onFieldChange(`education.${index}.endDate`, v)} className="inline"/>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline">
                           <EditableField value={edu.degree} onChange={v => onFieldChange(`education.${index}.degree`, v)} className="font-sans text-body-text dark:text-gray-300"/>
                           <EditableField value={edu.location} onChange={v => onFieldChange(`education.${index}.location`, v)} className="text-sm text-muted-text dark:text-gray-400 font-sans"/>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </div>
);


const ModernTemplate: React.FC<TemplateProps> = ({ resumeData, onFieldChange }) => (
    <div className="font-sans">
        <header className="text-center mb-8">
            <EditableField tag="h1" value={resumeData.name} onChange={v => onFieldChange('name', v)} className="text-4xl font-serif font-bold text-ink dark:text-white" />
            <EditableField tag="p" value={resumeData.targetRole} onChange={v => onFieldChange('targetRole', v)} className="text-lg text-muted-text dark:text-gray-400 mt-1" />
        </header>

        <div className="grid grid-cols-3 gap-8">
            <aside className="col-span-1 space-y-6">
                <section>
                    <h2 className="text-md font-bold text-ink dark:text-white uppercase tracking-widest border-b border-gray-200 dark:border-gray-600 pb-1 mb-2">Contact</h2>
                    <div className="text-xs space-y-1.5">
                        <div className="flex items-center space-x-2"><EnvelopeIcon className="w-4 h-4 text-muted-text"/><EditableField value={resumeData.contact.email} onChange={v => onFieldChange('contact.email', v)} /></div>
                        <div className="flex items-center space-x-2"><PhoneIcon className="w-4 h-4 text-muted-text"/><EditableField value={resumeData.contact.phone} onChange={v => onFieldChange('contact.phone', v)} /></div>
                        <div className="flex items-center space-x-2"><MapPinIcon className="w-4 h-4 text-muted-text"/><EditableField value={resumeData.contact.location} onChange={v => onFieldChange('contact.location', v)} /></div>
                    </div>
                </section>
                <section>
                    <h2 className="text-md font-bold text-ink dark:text-white uppercase tracking-widest border-b border-gray-200 dark:border-gray-600 pb-1 mb-2">Skills</h2>
                    <EditableField value={resumeData.skills.join(', ')} onChange={v => onFieldChange('skills', v.split(',').map(s => s.trim()))} className="text-sm" />
                </section>
                <section>
                    <h2 className="text-md font-bold text-ink dark:text-white uppercase tracking-widest border-b border-gray-200 dark:border-gray-600 pb-1 mb-2">Education</h2>
                     <div className="space-y-3">
                        {resumeData.education.map((edu, index) => (
                            <div key={edu.id} className="page-break-inside-avoid">
                                <h3 className="font-bold text-ink dark:text-white text-sm">
                                    <EditableField value={edu.institution} onChange={v => onFieldChange(`education.${index}.institution`, v)} />
                                </h3>
                                <EditableField value={edu.degree} onChange={v => onFieldChange(`education.${index}.degree`, v)} className="text-xs"/>
                                <EditableField value={`${edu.startDate} - ${edu.endDate}`} onChange={v => {
                                        const parts = v.split('-').map(p => p.trim());
                                        onFieldChange(`education.${index}.startDate`, parts[0] || '');
                                        onFieldChange(`education.${index}.endDate`, parts[1] || '');
                                    }} className="text-xs text-muted-text" />
                            </div>
                        ))}
                    </div>
                </section>
            </aside>
            <main className="col-span-2">
                <section>
                    <h2 className="text-lg font-bold text-ink dark:text-white uppercase tracking-widest border-b-2 border-gray-200 dark:border-gray-600 pb-1 mb-4">Experience</h2>
                    <div className="space-y-6">
                         {resumeData.experience.map((exp, index) => (
                            <div key={exp.id} className="page-break-inside-avoid">
                                <h3 className="text-lg font-bold text-ink dark:text-white">
                                    <EditableField value={exp.jobTitle} onChange={v => onFieldChange(`experience.${index}.jobTitle`, v)} />
                                </h3>
                                <div className="flex justify-between items-baseline mb-2 text-sm text-muted-text">
                                    <EditableField value={`${exp.company} — ${exp.location}`} onChange={v => {
                                        const parts = v.split('—').map(p => p.trim());
                                        onFieldChange(`experience.${index}.company`, parts[0] || '');
                                        onFieldChange(`experience.${index}.location`, parts[1] || '');
                                    }}/>
                                    <EditableField value={`${exp.startDate} - ${exp.endDate}`} onChange={v => {
                                        const parts = v.split('-').map(p => p.trim());
                                        onFieldChange(`experience.${index}.startDate`, parts[0] || '');
                                        onFieldChange(`experience.${index}.endDate`, parts[1] || '');
                                    }}/>
                                </div>
                                <ul className="list-disc pl-5 space-y-1 text-body-text dark:text-gray-300">
                                    {exp.bullets.map((bullet, bIndex) => (
                                        <li key={bIndex}>
                                            <EditableField tag="li" value={bullet} onChange={v => onFieldChange(`experience.${index}.bullets.${bIndex}`, v)} className="inline-block"/>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    </div>
);
