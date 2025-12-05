import { Quest } from "../types";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface QuestGenerationInput {
  goal: string;
  duration?: string;
  difficulty?: "easy" | "medium" | "hard";
  frequency?: "daily" | "weekly" | "custom";
}

interface AdviceInput {
  level: number;
  totalXp: number;
  todayXp: number;
  streak: number;
  questsCompleted: number;
  recentCategories: string[];
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1/models";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  }

  private async callAPI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error(
        "Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY or provide it in settings."
      );
    }

    console.log(
      "Calling Gemini API with key:",
      this.apiKey.substring(0, 10) + "..."
    );

    const response = await fetch(
      `${this.baseUrl}/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error response:", error);
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data: GeminiResponse = await response.json();
    console.log("Gemini API response:", data);
    return data.candidates[0]?.content?.parts[0]?.text || "";
  }

  async generateQuests(input: QuestGenerationInput): Promise<Quest[]> {
    const prompt = `You are a productivity coach helping users achieve their goals by breaking them down into actionable tasks.

Goal: ${input.goal}
Duration: ${input.duration || "1 month"}
Difficulty: ${input.difficulty || "medium"}
Frequency: ${input.frequency || "daily"}

Generate a list of 5-10 specific, actionable quests (tasks) that will help achieve this goal.
Each quest should be:
- Specific and measurable
- Achievable within a day or week
- Relevant to the goal
- Time-bound if applicable

Return ONLY a valid JSON array of objects with the following structure:
[
  {
    "title": "Quest title (max 50 characters)",
    "description": "Detailed description",
    "category": "work|health|learning|relationships|money|hobbies|life",
    "xpReward": 10-100,
    "priority": "low|medium|high",
    "scheduleType": "once|daily|weekly"
  }
]

Do not include any markdown formatting or code blocks. Return only the raw JSON array.`;

    try {
      const response = await this.callAPI(prompt);

      // Remove markdown code blocks if present
      let jsonText = response.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      }

      const quests = JSON.parse(jsonText);

      // Add required fields for Quest type
      return quests.map((q: any, index: number) => ({
        ...q,
        id: `ai-quest-${Date.now()}-${index}`,
        userId: "temp", // Will be set by the caller
        tags: ["ai-generated"],
        status: "active" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Failed to generate quests:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("API error")) {
          throw new Error(
            `API Error: ${error.message}. Please check your API key in Settings.`
          );
        }
        if (error.message.includes("API key is not configured")) {
          throw new Error(
            "API key is not configured. Please set your Gemini API key in Settings."
          );
        }
        throw error;
      }

      throw new Error(
        "Failed to generate quests. Please check the browser console for details."
      );
    }
  }

  async generateAdvice(input: AdviceInput): Promise<string> {
    const prompt = `You are a motivational coach for a gamified productivity app called "Level-Life".

User Stats:
- Level: ${input.level}
- Total XP: ${input.totalXp}
- Today's XP: ${input.todayXp}
- Current Streak: ${input.streak} days
- Quests Completed: ${input.questsCompleted}
- Recent Categories: ${input.recentCategories.join(", ")}

Based on these stats, provide a short, encouraging message (2-3 sentences) that:
1. Acknowledges their progress
2. Provides actionable advice or motivation
3. Is positive and energizing

Keep it casual and friendly. Use emojis if appropriate.
Return ONLY the message text, no additional formatting.`;

    try {
      const response = await this.callAPI(prompt);
      return response.trim();
    } catch (error) {
      console.error("Failed to generate advice:", error);
      throw new Error("Failed to generate advice. Please try again later.");
    }
  }
}

// Singleton instance
let geminiService: GeminiService | null = null;

export function getGeminiService(apiKey?: string): GeminiService {
  // Try to get API key from localStorage if not provided
  if (!apiKey && typeof window !== "undefined") {
    try {
      apiKey = localStorage.getItem("level-life:gemini-api-key") || undefined;
    } catch (error) {
      console.error("Failed to get API key from localStorage:", error);
    }
  }

  if (!geminiService || apiKey) {
    geminiService = new GeminiService(apiKey);
  }
  return geminiService;
}
