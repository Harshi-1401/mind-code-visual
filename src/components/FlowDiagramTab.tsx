import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { FlowStep } from "@/hooks/useExplainCode";

const shapeClasses: Record<string, string> = {
  start: "rounded-full bg-primary text-primary-foreground",
  end: "rounded-full bg-primary text-primary-foreground",
  process: "rounded-lg bg-secondary text-secondary-foreground border border-border",
  decision: "rounded-lg bg-accent text-accent-foreground rotate-0",
};

export function FlowDiagramTab({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="p-6 overflow-auto h-full flex flex-col items-center gap-2">
      {steps.map((step, i) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className={`px-5 py-2.5 text-sm font-medium text-center min-w-[140px] shadow-card ${shapeClasses[step.type]}`}>
            {step.type === "decision" ? `◇ ${step.label}` : step.label}
          </div>
          {i < steps.length - 1 && (
            <ArrowDown className="h-5 w-5 text-muted-foreground my-1" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
