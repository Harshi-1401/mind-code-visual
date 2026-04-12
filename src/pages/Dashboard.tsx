import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { CodeInputPanel } from "@/components/CodeInputPanel";
import { OutputPanel } from "@/components/OutputPanel";
import { useTheme } from "@/hooks/useTheme";
import { useExplainCode } from "@/hooks/useExplainCode";
import { useChats } from "@/hooks/useChats";
import { detectLanguage } from "@/lib/detectLanguage";
import type { Language, Difficulty } from "@/lib/constants";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { isDark, toggle } = useTheme();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("python");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { explanation, flowSteps, loading, flowLoading, error, explain, generateFlow, setExplanation, setFlowSteps } = useExplainCode();
  const { chats, activeChat, setActiveChat, saveChat, deleteChat, renameChat, newChat, getActiveChat } = useChats();

  // Auto-detect language
  useEffect(() => {
    if (code.trim().length > 20) {
      setLanguage(detectLanguage(code));
    }
  }, [code]);

  // Load active chat
  useEffect(() => {
    const chat = getActiveChat();
    if (chat) {
      setCode(chat.code_input);
      setLanguage(chat.language as Language);
      setDifficulty(chat.difficulty_level as Difficulty);
      setExplanation(chat.explanation);
      setFlowSteps(chat.flow_steps);
    }
  }, [activeChat]);

  const handleNewChat = () => {
    newChat();
    setCode("");
    setExplanation(null);
    setFlowSteps(null);
    setLanguage("python");
    setDifficulty("beginner");
  };

  const handleExplain = async () => {
    if (!code.trim()) {
      toast.error("Please paste some code first!");
      return;
    }
    await explain(code, difficulty);
  };

  // Save after explanation completes
  useEffect(() => {
    if (explanation) {
      saveChat({
        code_input: code,
        language,
        difficulty_level: difficulty,
        explanation,
        summary: explanation.summary,
      });
    }
  }, [explanation]);

  const handleFlow = async () => {
    if (!code.trim()) {
      toast.error("Please paste some code first!");
      return;
    }
    await generateFlow(code);
  };

  // Save after flow completes
  useEffect(() => {
    if (flowSteps) {
      saveChat({
        code_input: code,
        language,
        difficulty_level: difficulty,
        flow_steps: flowSteps,
      });
    }
  }, [flowSteps]);

  const handleSelectChat = (id: string) => {
    setActiveChat(id);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      {sidebarOpen && (
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={deleteChat}
          onRenameChat={renameChat}
          isDark={isDark}
          onToggleTheme={toggle}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-11 flex items-center gap-2 px-3 border-b border-border bg-card/80 backdrop-blur-md">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-foreground truncate">
            {getActiveChat()?.title || "New Chat"}
          </span>
        </div>

        {/* Split layout */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border min-h-[250px] lg:min-h-0 flex flex-col">
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
    </div>
  );
}
