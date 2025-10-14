import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Clock } from "lucide-react";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  topic: string;
  category: string;
  prompt: string;
  timestamp: Date;
}

interface PromptHistoryProps {
  history: HistoryItem[];
  onSelectPrompt: (prompt: string) => void;
}

export const PromptHistory = ({ history, onSelectPrompt }: PromptHistoryProps) => {
  const categoryEmojis: Record<string, string> = {
    coding: "💻",
    art: "🎨",
    business: "💼",
    research: "🔬",
    fun: "🎮",
  };

  const handleCopy = async (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copied!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  if (history.length === 0) {
    return (
      <Card className="glass-effect p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
          <Clock className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Your prompt history will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-effect p-4 h-full">
      <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        History
      </h3>
      <ScrollArea className="h-[calc(100%-3rem)]">
        <div className="space-y-3 pr-4">
          {history.map((item) => (
            <Card
              key={item.id}
              className="p-4 cursor-pointer hover:border-primary/50 transition-all duration-200 bg-background/50"
              onClick={() => onSelectPrompt(item.prompt)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg">{categoryEmojis[item.category]}</span>
                  <span className="text-sm font-medium truncate">{item.topic}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 shrink-0"
                  onClick={(e) => handleCopy(item.prompt, e)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.prompt}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {item.timestamp.toLocaleTimeString()}
              </p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};