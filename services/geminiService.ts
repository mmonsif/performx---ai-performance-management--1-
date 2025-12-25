
import { GoogleGenAI, Type } from "@google/genai";
import { Employee } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    const response = await ai.models.generateContent({
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
    const response = await ai.models.generateContent({
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
