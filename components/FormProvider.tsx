
import React from 'react';
import type { ResumeData, AppSettings, Experience, Education, Seniority, Tone, Template } from '../types';
import { SENIORITY_LEVELS, TONE_OPTIONS, TEMPLATE_OPTIONS } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { TagInput } from './ui/TagInput';
import { TrashIcon, PlusIcon, SparklesIcon, ArrowUturnLeftIcon, ArrowPathIcon } from './icons';

interface FormProviderProps {
    resumeData: ResumeData;
    settings: AppSettings;
    isLoading: Record<string, boolean>;
    onFieldChange: (path: string, value: any) => void;
    onSettingsChange: (field: keyof AppSettings, value: any) => void;
    onAddExperience: () => void;
    onRemoveExperience: (id: string) => void;
    onAddEducation: () => void;
    onRemoveEducation: (id: string) => void;
    onGenerateBullets: (id: string) => void;
    onGenerateAll: () => void;
    onUndo: (id: string) => void;
}

export const FormProvider: React.FC<FormProviderProps> = ({
    resumeData, settings, isLoading, onFieldChange, onSettingsChange,
    onAddExperience, onRemoveExperience, onAddEducation, onRemoveEducation,
    onGenerateBullets, onGenerateAll, onUndo
}) => {
    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-serif font-bold text-ink dark:text-dark-text mb-4">Global Settings</h2>
                <div className="space-y-4">
                    <Input
                        label="Target Role"
                        value={resumeData.targetRole}
                        onChange={(e) => onFieldChange('targetRole', e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                    />
                    <Select
                        label="Seniority Level"
                        value={settings.seniority}
                        onChange={(e) => onSettingsChange('seniority', e.target.value as Seniority)}
                        options={SENIORITY_LEVELS.map(s => ({ value: s, label: s }))}
                    />
                    <Select
                        label="Tone"
                        value={settings.tone}
                        onChange={(e) => onSettingsChange('tone', e.target.value as Tone)}
                        options={TONE_OPTIONS.map(t => ({ value: t, label: t }))}
                    />
                    <Select
                        label="Resume Template"
                        value={settings.template}
                        onChange={(e) => onSettingsChange('template', e.target.value as Template)}
                        options={TEMPLATE_OPTIONS}
                    />
                    <Textarea
                        label="Job Description / Keywords"
                        value={settings.jobDescription}
                        onChange={(e) => onSettingsChange('jobDescription', e.target.value)}
                        placeholder="Paste a job description here to tailor results..."
                        rows={5}
                    />
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-serif font-bold text-ink dark:text-dark-text mb-4">Skills</h2>
                <TagInput
                    label="Enter your skills"
                    tags={resumeData.skills}
                    onTagsChange={(tags) => onFieldChange('skills', tags)}
                />
            </Card>

            {resumeData.experience.map((exp, index) => (
                <ExperienceForm
                    key={exp.id}
                    experience={exp}
                    index={index}
                    isLoading={isLoading[exp.id] || false}
                    onFieldChange={onFieldChange}
                    onRemove={() => onRemoveExperience(exp.id)}
                    onGenerate={() => onGenerateBullets(exp.id)}
                    onUndo={() => onUndo(exp.id)}
                />
            ))}

            <div className="flex items-center space-x-2">
                <Button onClick={onAddExperience} variant="secondary" className="w-full">
                    <PlusIcon className="w-5 h-5 mr-2" /> Add Experience
                </Button>
                <Button onClick={onGenerateAll} variant="primary" className="w-full" isLoading={isLoading.all}>
                    <SparklesIcon className="w-5 h-5 mr-2" /> Generate All
                </Button>
            </div>
            
            {resumeData.education.map((edu, index) => (
                <EducationForm
                    key={edu.id}
                    education={edu}
                    index={index}
                    onFieldChange={onFieldChange}
                    onRemove={() => onRemoveEducation(edu.id)}
                />
            ))}

            <Button onClick={onAddEducation} variant="secondary" className="w-full">
                <PlusIcon className="w-5 h-5 mr-2" /> Add Education
            </Button>
        </div>
    );
};

interface ExperienceFormProps {
    experience: Experience;
    index: number;
    isLoading: boolean;
    onFieldChange: (path: string, value: any) => void;
    onRemove: () => void;
    onGenerate: () => void;
    onUndo: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, index, isLoading, onFieldChange, onRemove, onGenerate, onUndo }) => {
    const handleChange = (field: keyof Omit<Experience, 'id' | 'tech' | 'bullets' | 'generations'>, value: string) => {
        onFieldChange(`experience.${index}.${field}`, value);
    };
    
    const handleTechChange = (tech: string[]) => {
        onFieldChange(`experience.${index}.tech`, tech);
    };

    return (
        <Card>
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Experience #{index + 1}</h3>
                <button onClick={onRemove} className="text-muted-text hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 -mt-1 -mr-1">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="space-y-4">
                <Input label="Job Title" value={experience.jobTitle} onChange={(e) => handleChange('jobTitle', e.target.value)} />
                <Input label="Company" value={experience.company} onChange={(e) => handleChange('company', e.target.value)} />
                <Input label="Location" value={experience.location} onChange={(e) => handleChange('location', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Start Date" type="month" value={experience.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
                    <Input label="End Date" type="month" value={experience.endDate} onChange={(e) => handleChange('endDate', e.target.value)} />
                </div>
                <TagInput label="Tech / Tools" tags={experience.tech} onTagsChange={handleTechChange} />
                <Textarea label="Achievements / Notes" rows={6} value={experience.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Your raw notes on what you did..." />
                <div className="flex items-center space-x-2 pt-2">
                    <Button onClick={onGenerate} variant="primary" className="w-full" isLoading={isLoading}>
                        {experience.bullets.length > 0 ? <ArrowPathIcon className="w-5 h-5 mr-2" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                        {experience.bullets.length > 0 ? 'Regenerate' : 'Generate Bullets'}
                    </Button>
                    <Button onClick={onUndo} variant="secondary" disabled={experience.generations.length === 0} title="Undo to previous generation">
                        <ArrowUturnLeftIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

interface EducationFormProps {
    education: Education;
    index: number;
    onFieldChange: (path: string, value: any) => void;
    onRemove: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ education, index, onFieldChange, onRemove }) => {
    const handleChange = (field: keyof Omit<Education, 'id'>, value: string) => {
        onFieldChange(`education.${index}.${field}`, value);
    };

    return (
        <Card>
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Education #{index + 1}</h3>
                <button onClick={onRemove} className="text-muted-text hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 -mt-1 -mr-1">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="space-y-4">
                <Input label="Institution" value={education.institution} onChange={(e) => handleChange('institution', e.target.value)} />
                <Input label="Degree" value={education.degree} onChange={(e) => handleChange('degree', e.target.value)} />
                <Input label="Location" value={education.location} onChange={(e) => handleChange('location', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Start Date" type="month" value={education.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
                    <Input label="End Date" type="month" value={education.endDate} onChange={(e) => handleChange('endDate', e.target.value)} />
                </div>
            </div>
        </Card>
    );
};
