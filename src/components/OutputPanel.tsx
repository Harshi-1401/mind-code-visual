import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExplanationTab } from "./ExplanationTab";
import { FlowDiagramTab } from "./FlowDiagramTab";
import { FileText, Workflow, Loader2 } from "lucide-react";
import type { Explanation, FlowStep } from "@/hooks/useExplainCode";

interface Props {
  explanation: Explanation | null;
  flowSteps: FlowStep[] | null;
  loading: boolean;
  flowLoading: boolean;
  error: string | null;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">No explanation yet</h3>
      <p className="text-sm text-muted-foreground max-w-[240px]">
        Paste your code and click "Explain Code" to get a detailed breakdown.
      </p>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function OutputPanel({ explanation, flowSteps, loading, flowLoading, error }: Props) {
  return (
    <Tabs defaultValue="explanation" className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-3">
        <TabsList className="bg-transparent h-10 gap-1">
          <TabsTrigger value="explanation" className="text-xs data-[state=active]:bg-secondary gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Explanation
          </TabsTrigger>
          <TabsTrigger value="flow" className="text-xs data-[state=active]:bg-secondary gap-1.5">
            <Workflow className="h-3.5 w-3.5" /> Flow Diagram
          </TabsTrigger>
        </TabsList>
      </div>

      {error && (
        <div className="mx-4 mt-3 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <TabsContent value="explanation" className="flex-1 min-h-0 mt-0">
        {loading ? <LoadingState label="Analyzing your code..." /> : explanation ? <ExplanationTab data={explanation} /> : <EmptyState />}
      </TabsContent>

      <TabsContent value="flow" className="flex-1 min-h-0 mt-0">
        {flowLoading ? <LoadingState label="Generating flow diagram..." /> : flowSteps ? <FlowDiagramTab steps={flowSteps} /> : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Workflow className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">No flow diagram yet</h3>
            <p className="text-sm text-muted-foreground max-w-[240px]">Click "Generate Flow" to visualize your code logic.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
