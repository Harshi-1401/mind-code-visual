import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play, Workflow, Sparkles, Loader2 } from "lucide-react";
import { LANGUAGES, SAMPLE_CODE, type Language, type Difficulty } from "@/lib/constants";

const langExtensions = {
  python: [python()],
  javascript: [javascript()],
  java: [java()],
  cpp: [cpp()],
};

interface Props {
  code: string;
  onCodeChange: (v: string) => void;
  language: Language;
  onLanguageChange: (v: Language) => void;
  difficulty: Difficulty;
  onDifficultyChange: (v: Difficulty) => void;
  onExplain: () => void;
  onFlow: () => void;
  loading: boolean;
  flowLoading: boolean;
}

export function CodeInputPanel({
  code, onCodeChange, language, onLanguageChange,
  difficulty, onDifficultyChange, onExplain, onFlow, loading, flowLoading,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border bg-card">
        <Select value={language} onValueChange={(v) => onLanguageChange(v as Language)}>
          <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={(v) => onDifficultyChange(v as Difficulty)}>
          <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">🟢 Beginner</SelectItem>
            <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="h-8 text-xs text-muted-foreground" onClick={() => onCodeChange(SAMPLE_CODE[language])}>
          <Sparkles className="h-3 w-3 mr-1" /> Example
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <CodeMirror
          value={code}
          onChange={onCodeChange}
          extensions={langExtensions[language]}
          theme={vscodeDark}
          className="h-full text-sm"
          height="100%"
          basicSetup={{ lineNumbers: true, foldGutter: true }}
        />
      </div>

      <div className="flex flex-wrap gap-2 p-3 border-t border-border bg-card">
        <Button onClick={onExplain} disabled={loading || !code.trim()} className="gradient-primary text-primary-foreground font-semibold text-sm h-9">
          {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Play className="h-4 w-4 mr-1.5" />}
          Explain Code
        </Button>
        <Button variant="outline" onClick={onFlow} disabled={flowLoading || !code.trim()} className="text-sm h-9">
          {flowLoading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Workflow className="h-4 w-4 mr-1.5" />}
          Generate Flow
        </Button>
      </div>
    </div>
  );
}
