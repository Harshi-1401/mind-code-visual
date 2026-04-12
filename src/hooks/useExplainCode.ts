import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/lib/constants";

export interface Explanation {
  lines: { line: string; explanation: string }[];
  summary: string;
}

export interface FlowStep {
  id: number;
  type: "start" | "process" | "decision" | "end";
  label: string;
}

export function useExplainCode() {
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [flowSteps, setFlowSteps] = useState<FlowStep[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [flowLoading, setFlowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const explain = async (code: string, difficulty: Difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("explain-code", {
        body: { code, difficulty, mode: "explain" },
      });
      if (fnError) throw fnError;
      setExplanation(data as Explanation);
    } catch (e: any) {
      setError(e.message || "Failed to explain code");
    } finally {
      setLoading(false);
    }
  };

  const generateFlow = async (code: string) => {
    setFlowLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("explain-code", {
        body: { code, mode: "flow" },
      });
      if (fnError) throw fnError;
      setFlowSteps(data as FlowStep[]);
    } catch (e: any) {
      setError(e.message || "Failed to generate flow diagram");
    } finally {
      setFlowLoading(false);
    }
  };

  return { explanation, flowSteps, loading, flowLoading, error, explain, generateFlow };
}
