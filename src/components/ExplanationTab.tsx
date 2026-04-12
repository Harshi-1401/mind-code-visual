import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Explanation } from "@/hooks/useExplainCode";

export function ExplanationTab({ data }: { data: Explanation }) {
  const [copied, setCopied] = useState(false);

  const fullText = data.lines.map((l) => `${l.line}\n→ ${l.explanation}`).join("\n\n") + `\n\nSummary: ${data.summary}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs text-muted-foreground">
          {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="space-y-3">
        {data.lines.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg bg-secondary/50 p-3 border border-border"
          >
            <code className="text-xs font-mono text-primary block mb-1.5">{item.line}</code>
            <p className="text-sm text-foreground/85 leading-relaxed">{item.explanation}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: data.lines.length * 0.05 }}
        className="rounded-lg gradient-primary p-4 mt-4"
      >
        <h3 className="text-sm font-bold text-primary-foreground mb-1">Summary</h3>
        <p className="text-sm text-primary-foreground/90 leading-relaxed">{data.summary}</p>
      </motion.div>
    </div>
  );
}
