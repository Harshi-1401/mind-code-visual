import { Moon, Sun, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2.5">
          <div className="gradient-primary rounded-lg p-1.5">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            AI Code Explainer
          </h1>
          <span className="hidden sm:inline text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            for Beginners
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleTheme} className="text-muted-foreground hover:text-foreground">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
