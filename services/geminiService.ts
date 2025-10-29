
import { GoogleGenAI, Type } from "@google/genai";
import type { GenerationContext, GenerationResult } from '../types';

const API_ENDPOINT = '/api/gemini'; // This would be your backend endpoint

const buildPrompt = (context: GenerationContext): string => {
    const { targetRole, seniority, tone, jobDescription, experience } = context;
    return `
      You are an expert resume writer. Your task is to generate 3-5 strong, metric-driven resume bullet points.

      **Resume Context:**
      - **Target Role:** ${targetRole}
      - **Candidate Seniority:** ${seniority}
      - **Desired Tone:** ${tone}
      - **Target Job Description/Keywords:** ${jobDescription || "Not provided"}

      **Experience Details:**
      - **Job Title:** ${experience.jobTitle}
      - **Company:** ${experience.company}
      - **Key Technologies/Tools:** ${experience.tech.join(', ')}
      - **Candidate's Raw Notes/Achievements:** ${experience.notes}

      **Instructions:**
      1.  Create 3 to 5 bullet points.
      2.  Each bullet must start with a strong, action-oriented verb.
      3.  Follow the STAR (Situation, Task, Action, Result) or CAR (Context, Action, Result) framework.
      4.  **Quantify everything.** Include metrics like percentages, dollar amounts, time saved, or scale (e.g., number of users, data volume).
      5.  If a metric is missing from the notes, infer a realistic, conservative placeholder and clearly mark it with "(placeholder)". Example: "...increasing efficiency by 15% (placeholder)."
      6.  Tailor the language and focus to the **Target Role**, **Seniority**, and **Job Description**.
      7.  Ensure each bullet is concise, ideally 1-2 lines long and under 30 words.
      8.  Do not use the first person (I, my, we).
      9.  Identify key technical skills or tools mentioned or implied and list them.
    `;
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        bullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 3-5 resume bullet points."
        },
        skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of key skills identified from the experience."
        }
    },
    required: ["bullets", "skills"]
};

const fallbackResponse: GenerationResult = {
    bullets: [
        "Led a cross-functional team of 5 engineers to deliver a new feature set, increasing user engagement by 20% (placeholder).",
        "Automated a critical data processing pipeline, reducing manual effort by 10 hours per week and improving data accuracy.",
        "Presented technical findings to senior leadership, influencing the strategic decision to adopt a new technology stack."
    ],
    skills: ["Project Management", "Automation", "Public Speaking"],
    isFallback: true
};

export const generateBullets = async (context: GenerationContext): Promise<GenerationResult> => {
    // In a real app, this would be a fetch call to a backend.
    // For this frontend-only example, we simulate the API call and use a fallback.
    console.log("Simulating Gemini API call with context:", context);
    
    // Placeholder to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        // This is where you would initialize and call the Gemini API on your backend
        // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        // const response = await ai.models.generateContent({
        //   model: 'gemini-2.5-flash',
        //   contents: buildPrompt(context),
        //   config: {
        //     responseMimeType: "application/json",
        //     responseSchema: responseSchema,
        //   },
        // });
        // const result = JSON.parse(response.text);
        // return { ...result, isFallback: false };
        
        // Frontend fetch to a backend proxy
        /*
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: buildPrompt(context),
                schema: responseSchema
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        return { ...data, isFallback: false };
        */

        // For this demo, we always return the fallback.
        console.warn("Using fallback response. Set up a backend endpoint at /api/gemini to use the real API.");
        return fallbackResponse;

    } catch (error) {
        console.error("Gemini API call failed, using fallback.", error);
        return fallbackResponse;
    }
};
