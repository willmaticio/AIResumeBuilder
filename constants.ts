
import type { Seniority, Tone, Template, ResumeData, AppSettings } from './types';

export const SENIORITY_LEVELS: Seniority[] = ['Intern', 'Entry', 'Mid', 'Senior', 'Lead', 'Manager', 'Director'];
export const TONE_OPTIONS: Tone[] = ['Concise', 'Confident', 'Impact-focused', 'Technical', 'Leadership'];
export const TEMPLATE_OPTIONS: { value: Template; label: string }[] = [
    { value: 'professional', label: 'Professional' },
    { value: 'modern', label: 'Modern' },
];

export const INITIAL_RESUME_DATA: ResumeData = {
    name: 'Your Name',
    targetRole: 'Data Scientist',
    contact: {
        email: 'your.email@example.com',
        phone: '(555) 123-4567',
        location: 'City, State',
    },
    skills: ['Python', 'SQL', 'Tableau', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'GCP', 'Airflow'],
    experience: [
        {
            id: crypto.randomUUID(),
            jobTitle: 'AI Engineer',
            company: 'WNN Industries',
            location: 'Remote',
            startDate: '2023-01',
            endDate: 'Present',
            tech: ['Kubernetes', 'Python', 'SOC2', 'GCP', 'Terraform'],
            notes: 'Led the development of a new fraud detection model. Also worked on migrating our services to a new cloud provider and improved system observability.',
            bullets: [
                "Spearheaded the development and deployment of a novel machine learning model for fraud detection, resulting in a 15% reduction in false positives and an estimated $1.2M annual savings.",
                "Orchestrated the migration of 3 core microservices to Google Cloud Platform (GCP) using Terraform and Kubernetes, improving system uptime by 25% and reducing infrastructure costs by 20%.",
                "Enhanced system observability by implementing a comprehensive monitoring and alerting stack with Prometheus and Grafana, decreasing mean time to resolution (MTTR) for production incidents by 40%."
            ],
            generations: [],
        },
    ],
    education: [
        {
            id: crypto.randomUUID(),
            institution: 'University of Technology',
            degree: 'M.S. in Computer Science',
            location: 'Metropolis, USA',
            startDate: '2021-09',
            endDate: '2022-12',
        }
    ]
};

export const INITIAL_SETTINGS: AppSettings = {
    seniority: 'Senior',
    tone: 'Impact-focused',
    jobDescription: '',
    template: 'professional',
};
