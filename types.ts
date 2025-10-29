
export type Seniority = 'Intern' | 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Manager' | 'Director';
export type Tone = 'Concise' | 'Confident' | 'Impact-focused' | 'Technical' | 'Leadership';
export type Template = 'professional' | 'modern';

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  tech: string[];
  notes: string;
  bullets: string[];
  generations: string[][]; // For undo history
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  name: string;
  targetRole: string;
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  skills: string[];
  experience: Experience[];
  education: Education[];
}

export interface AppSettings {
  seniority: Seniority;
  tone: Tone;
  jobDescription: string;
  template: Template;
}

export interface GenerationContext {
  targetRole: string;
  seniority: Seniority;
  tone: Tone;
  jobDescription: string;
  experience: Omit<Experience, 'bullets' | 'generations'>;
}

export interface GenerationResult {
  bullets: string[];
  skills: string[];
  isFallback?: boolean;
}
