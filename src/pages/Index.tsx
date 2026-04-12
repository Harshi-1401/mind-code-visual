import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CodeInputPanel } from "@/components/CodeInputPanel";
import { OutputPanel } from "@/components/OutputPanel";
import { useTheme } from "@/hooks/useTheme";
import { useExplainCode } from "@/hooks/useExplainCode";
import { detectLanguage } from "@/lib/detectLanguage";
import type { Language, Difficulty } from "@/lib/constants";
import { toast } from "sonner";

const Index = () => {
  const { isDark, toggle } = useTheme();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("python");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const { explanation, flowSteps, loading, flowLoading, error, explain, generateFlow } = useExplainCode();

  useEffect(() => {
    if (code.trim().length > 20) {
      const detected = detectLanguage(code);
      setLanguage(detected);
    }
  }, [code]);

  const handleExplain = () => {
    if (!code.trim()) {
      toast.error("Please paste some code first!");
      return;
    }
    explain(code, difficulty);
  };

  const handleFlow = () => {
    if (!code.trim()) {
      toast.error("Please paste some code first!");
      return;
    }
    generateFlow(code);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header isDark={isDark} onToggleTheme={toggle} />
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border min-h-[300px] lg:min-h-0 flex flex-col">
          <CodeInputPanel
            code={code}
            onCodeChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onExplain={handleExplain}
            onFlow={handleFlow}
            loading={loading}
            flowLoading={flowLoading}
          />
        </div>
        <div className="lg:w-1/2 flex-1 flex flex-col min-h-0">
          <OutputPanel
            explanation={explanation}
            flowSteps={flowSteps}
            loading={loading}
            flowLoading={flowLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
