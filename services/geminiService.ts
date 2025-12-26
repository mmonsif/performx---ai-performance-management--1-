
import { GoogleGenAI, Type } from "@google/genai";
import { Employee } from "../types.ts";

/**
 * Lazily create a GoogleGenAI client only when an API key is available.
 * Avoid creating the client at import time to prevent runtime errors in the browser
 * (the SDK requires an API key when used in-browser). For production, move AI
 * calls to a secure server endpoint that holds the key.
 */
const createAIClient = () => {
  const apiKey = (import.meta as any).env?.VITE_GENAI_API_KEY ?? process.env.API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    // If the library refuses to initialize in the browser, return null and let callers handle it.
    return null;
  }
};

const proxyCall = async (payload: { model: string, contents: string, config?: any }) => {
  const base = (import.meta as any).env?.VITE_GENAI_API_URL ?? null;
  if (!base) return null;
  try {
    const resp = await fetch(`${base.replace(/\/$/, '')}/api/genai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Unknown proxy error' }));
      return { error: err.error || 'Proxy returned non-OK' };
    }
    return await resp.json();
  } catch (err) {
    return { error: String(err) };
  }
};

export const getAIPerformanceSummary = async (employee: Employee) => {
  const reviewsText = employee.reviews.map(r => `[${r.category}] Rating: ${r.rating}/5. Comment: ${r.comments}`).join('\n');
  const goalsText = employee.goals.map(g => `${g.title} (${g.status}): ${g.progress}%`).join('\n');

  const prompt = `
    Analyze performance for ${employee.name}:
    REVIEWS: ${reviewsText}
    GOALS: ${goalsText}
    SCORE: ${employee.performanceScore}/5
    
    Provide: Key Strengths, Areas for Improvement, Growth Recommendations, and a "tl;dr".
  `;

  try {
    // Prefer proxy if configured
    const proxyResult = await proxyCall({ model: "gemini-3-flash-preview", contents: prompt, config: { systemInstruction: "You are an expert HR Analyst. Be constructive and data-driven.", temperature: 0.7 } });
    if (proxyResult) {
      if ((proxyResult as any).error) return "Error from GenAI proxy: " + (proxyResult as any).error;
      return (proxyResult as any).text;
    }

    const client = createAIClient();
    if (!client) {
      return "AI is unavailable in this environment. Configure a secure server-side endpoint or set VITE_GENAI_API_KEY for local dev (not recommended).";
    }

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert HR Analyst. Be constructive and data-driven.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    return "Error generating AI insights.";
  }
};

export const generateYTDReport = async (employee: Employee, orgContext: { avgScore: number, avgGoalCompletion: number }) => {
  const data = {
    assessments: employee.monthlyAssessments,
    absences: employee.absences,
    goals: employee.goals,
    hireDate: employee.joiningDate,
    notes: employee.notesHistory
  };

  const prompt = `
    Generate a comprehensive STRATEGIC YEAR-TO-DATE (YTD) INTELLIGENCE REPORT for:
    Subject: ${employee.name}
    Role: ${employee.role}
    Dept: ${employee.department}
    Hire Date: ${data.hireDate}
    
    INDIVIDUAL QUANTITATIVE DATA:
    - Current Aggregate Performance Score: ${employee.performanceScore}/5
    - Monthly Check-in Ratings History: ${JSON.stringify(data.assessments)}
    - Attendance Integrity: ${data.absences.length} unscheduled leave entries.
    - Milestone Velocity: ${JSON.stringify(data.goals)}
    - Qualitative Managerial Logs: ${JSON.stringify(data.notes)}

    ORGANIZATIONAL CONTEXT (BENCHMARKS):
    - Company-wide Average Performance Score: ${orgContext.avgScore.toFixed(2)}/5
    - Company-wide Average Milestone Completion: ${orgContext.avgGoalCompletion.toFixed(0)}%

    INSTRUCTIONS:
    Provide a sophisticated analysis that contrasts this employee's trajectory against the organizational averages.
    
    Please structure the report with these precise headers:
    1. Executive Intelligence Summary (Overall vibe and high-level trajectory)
    2. Comparative Performance Analysis (Deep-dive vs Company Averages. Is the employee a leader, a maintainer, or a risk?)
    3. Reliability & Operational Integrity (Analysis of absences and consistency across months)
    4. Strategic Alignment & Velocity (How their goals move the needle for ${employee.department})
    5. Leadership Potential & Readiness (Assessment for promotion or advanced mentorship)
    6. Corrective Actions or Optimization Strategy (Clear steps for the next quarter)
  `;

  try {
    // Prefer proxy if configured
    const proxyResult = await proxyCall({ model: "gemini-3-pro-preview", contents: prompt, config: { systemInstruction: "You are a Chief People Officer generating a high-stakes formal internal brief. Use authoritative, sophisticated language. Use markdown formatting for readability. Focus heavily on comparative metrics.", temperature: 0.4 } });
    if (proxyResult) {
      if ((proxyResult as any).error) return "Error from GenAI proxy: " + (proxyResult as any).error;
      return (proxyResult as any).text;
    }

    const client = createAIClient();
    if (!client) {
      return "AI is unavailable in this environment. Configure a secure server-side endpoint or set VITE_GENAI_API_KEY for local dev (not recommended).";
    }

    const response = await client.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a Chief People Officer generating a high-stakes formal internal brief. Use authoritative, sophisticated language. Use markdown formatting for readability. Focus heavily on comparative metrics.",
        temperature: 0.4,
      },
    });
    return response.text;
  } catch (error) {
    return "Failed to generate YTD report. Verify data availability.";
  }
};

/**
 * Analyze a small organizational snapshot string and return a short strategic outlook.
 * This centralizes client handling and keeps frontend components simple.
 */
export const analyzeOrgSnapshot = async (snapshot: string) => {
  const prompt = `Analyze this organizational snapshot and provide a concise 2-sentence strategic outlook. Snapshot:\n${snapshot}`;
  try {
    const client = createAIClient();
    if (!client) {
      return "AI is unavailable in this environment. Configure a secure server-side endpoint or set VITE_GENAI_API_KEY for local dev (not recommended).";
    }

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { temperature: 0.5 }
    });
    return response.text;
  } catch (err) {
    return "Error generating insights.";
  }
};
