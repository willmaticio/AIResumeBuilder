
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FormProvider } from './components/FormProvider';
import { ResumePreview } from './components/ResumePreview';
import { Header } from './components/Header';
import { generateBullets as generateBulletsFromApi } from './services/geminiService';
import type { ResumeData, Experience, AppSettings, Template, Seniority, Tone } from './types';
import { SENIORITY_LEVELS, TONE_OPTIONS, INITIAL_RESUME_DATA, INITIAL_SETTINGS } from './constants';

const App: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
    const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [showToast, setShowToast] = useState<string | null>(null);

    const debounceTimeout = useRef<number | null>(null);

    // Debounced state saving
    const saveStateDebounced = useCallback(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = window.setTimeout(() => {
            localStorage.setItem('resumeData', JSON.stringify(resumeData));
            localStorage.setItem('settings', JSON.stringify(settings));
        }, 3000);
    }, [resumeData, settings]);

    useEffect(() => {
        saveStateDebounced();
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [resumeData, settings, saveStateDebounced]);
    
    // Load state from localStorage on initial render
    useEffect(() => {
        try {
            const savedResumeData = localStorage.getItem('resumeData');
            if (savedResumeData) setResumeData(JSON.parse(savedResumeData));

            const savedSettings = localStorage.getItem('settings');
            if (savedSettings) setSettings(JSON.parse(savedSettings));

            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme as 'light' | 'dark');
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    // Theme management
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const displayToast = (message: string) => {
        setShowToast(message);
        setTimeout(() => setShowToast(null), 3000);
    };

    const handleFieldChange = (
        path: string,
        value: any
    ) => {
        const keys = path.split('.');
        setResumeData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };
    
    const handleSettingsChange = (field: keyof AppSettings, value: string) => {
        setSettings(prev => ({...prev, [field]: value}));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                {
                    id: crypto.randomUUID(),
                    jobTitle: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    tech: [],
                    notes: '',
                    bullets: [],
                    generations: [],
                }
            ]
        }));
    };
    
    const removeExperience = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [
                ...prev.education,
                {
                    id: crypto.randomUUID(),
                    institution: '',
                    degree: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                }
            ]
        }));
    };

    const removeEducation = (id: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const generateBullets = async (experienceId: string) => {
        const experience = resumeData.experience.find(exp => exp.id === experienceId);
        if (!experience) return;

        setIsLoading(prev => ({ ...prev, [experienceId]: true }));
        try {
            const result = await generateBulletsFromApi({
                targetRole: resumeData.targetRole,
                seniority: settings.seniority,
                tone: settings.tone,
                jobDescription: settings.jobDescription,
                experience
            });

            if (result.isFallback) {
                displayToast('Offline mode: using sample bullets.');
            }

            setResumeData(prev => ({
                ...prev,
                skills: [...new Set([...prev.skills, ...result.skills])],
                experience: prev.experience.map(exp => 
                    exp.id === experienceId ? {
                        ...exp,
                        bullets: result.bullets,
                        generations: [exp.bullets, ...exp.generations].slice(0, 3)
                    } : exp
                )
            }));

        } catch (error) {
            console.error("Failed to generate bullets", error);
            displayToast('Error generating bullets.');
        } finally {
            setIsLoading(prev => ({ ...prev, [experienceId]: false }));
        }
    };
    
    const generateAllBullets = async () => {
        setIsLoading(prev => ({ ...prev, all: true }));
        for (const exp of resumeData.experience) {
            await generateBullets(exp.id);
        }
        setIsLoading(prev => ({ ...prev, all: false }));
    };

    const undoGeneration = (experienceId: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => {
                if (exp.id === experienceId && exp.generations.length > 0) {
                    const [lastGeneration, ...rest] = exp.generations;
                    return { ...exp, bullets: lastGeneration, generations: rest };
                }
                return exp;
            })
        }));
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const exportJSON = () => {
        const dataStr = JSON.stringify({ resumeData, settings }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `AI-Resume-Data-${new Date().toISOString().slice(0, 10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const importJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    const { resumeData: importedResumeData, settings: importedSettings } = JSON.parse(text);
                    if (importedResumeData && importedSettings) {
                        setResumeData(importedResumeData);
                        setSettings(importedSettings);
                        displayToast("Data imported successfully.");
                    } else {
                        displayToast("Invalid JSON structure.");
                    }
                }
            } catch (error) {
                console.error("Failed to import JSON", error);
                displayToast("Failed to read or parse JSON file.");
            }
        };
        reader.readAsText(file);
    };

    const resetState = () => {
      if (window.confirm("Are you sure you want to start a new resume? This will clear all current data.")) {
        setResumeData(INITIAL_RESUME_DATA);
        setSettings(INITIAL_SETTINGS);
        localStorage.removeItem('resumeData');
        localStorage.removeItem('settings');
      }
    };

    return (
        <div className="bg-gray-50 dark:bg-dark-bg min-h-screen font-sans text-body-text dark:text-dark-text">
            <Header
                theme={theme}
                toggleTheme={toggleTheme}
                exportJSON={exportJSON}
                importJSON={importJSON}
                resetState={resetState}
                resumeData={resumeData}
            />
            <main className="pt-20 p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-screen-2xl mx-auto">
                <div className="lg:col-span-2">
                    <FormProvider
                        resumeData={resumeData}
                        settings={settings}
                        isLoading={isLoading}
                        onFieldChange={handleFieldChange}
                        onSettingsChange={handleSettingsChange}
                        onAddExperience={addExperience}
                        onRemoveExperience={removeExperience}
                        onAddEducation={addEducation}
                        onRemoveEducation={removeEducation}
                        onGenerateBullets={generateBullets}
                        onGenerateAll={generateAllBullets}
                        onUndo={undoGeneration}
                    />
                </div>
                <div className="lg:col-span-3">
                    <ResumePreview
                        resumeData={resumeData}
                        template={settings.template}
                        onFieldChange={handleFieldChange}
                    />
                </div>
            </main>
            {showToast && (
                <div className="fixed bottom-5 right-5 bg-ink text-white dark:bg-surface dark:text-ink py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
                    {showToast}
                </div>
            )}
        </div>
    );
};

export default App;
