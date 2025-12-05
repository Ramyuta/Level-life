"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { getGeminiService } from "../../../lib/services/gemini";
import { useUser } from "../../user/context/UserContext";
import { useQuests } from "../../quests/hooks/useQuests";

export default function AIAdvisor() {
  const { user } = useUser();
  const { categories } = useQuests();
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      // Auto-generate on mount if not generated today
      const today = new Date().toISOString().split("T")[0];
      const lastDate = lastGenerated?.split("T")[0];
      
      if (lastGenerated && lastDate === today) {
        return;
      }

      setIsLoading(true);
      try {
        const gemini = getGeminiService();
        
        // Get recent categories from user stats
        const recentCategories = categories.slice(0, 3).map((c) => c.name);

        const newAdvice = await gemini.generateAdvice({
          level: user.level,
          totalXp: user.stats.totalXpEarned,
          todayXp: user.stats.todayXp,
          streak: user.streak.current,
          questsCompleted: user.stats.questsCompleted,
          recentCategories,
        });

        setAdvice(newAdvice);
        setLastGenerated(new Date().toISOString());
      } catch (error: any) {
        console.error("Failed to generate advice:", error);
        setAdvice(
          "Keep up the great work! 💪 Every quest you complete brings you closer to your goals."
        );
      } finally {
        setIsLoading(false);
      }
    };

    generate();
  }, [categories, lastGenerated, user.level, user.stats.totalXpEarned, user.stats.todayXp, user.stats.questsCompleted, user.streak]);

  const handleRefresh = () => {
    setLastGenerated(null); // This will trigger the effect
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20 p-6 ring-1 ring-purple-500/30 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="font-semibold text-white">AI Advisor</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="rounded-lg p-2 text-purple-300 transition-colors hover:bg-purple-500/20 disabled:opacity-50"
          title="Refresh advice"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </button>
      </div>

      {isLoading && !advice ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </div>
      ) : (
        <p className="text-slate-200">{advice}</p>
      )}
    </div>
  );
}
