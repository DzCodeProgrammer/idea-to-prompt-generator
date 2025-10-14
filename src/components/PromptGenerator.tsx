import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Copy, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PromptGeneratorProps {
  onPromptGenerated: (prompt: string, topic: string, category: string) => void;
}

export const PromptGenerator = ({ onPromptGenerated }: PromptGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("coding");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { value: "coding", label: "💻 Coding" },
    { value: "art", label: "🎨 Art & Design" },
    { value: "business", label: "💼 Business Idea" },
    { value: "research", label: "🔬 Research & Science" },
    { value: "fun", label: "🎮 Fun & Creative" },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or idea");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: { topic: topic.trim(), category }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      const prompt = data.prompt;
      setGeneratedPrompt(prompt);
      onPromptGenerated(prompt, topic, category);
      toast.success("Prompt generated successfully!");
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error("Failed to generate prompt. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy prompt");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="glass-effect p-6 space-y-4 border-2 hover:border-primary/50 transition-all duration-300">
        <div className="space-y-2">
          <label htmlFor="topic" className="text-sm font-medium">
            Your Topic or Idea
          </label>
          <Textarea
            id="topic"
            placeholder="E.g., 'Build a mobile app for fitness tracking' or 'Create a fantasy landscape illustration'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-[100px] resize-none bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Prompt
            </>
          )}
        </Button>
      </Card>

      {/* Result Section */}
      {generatedPrompt && (
        <Card className="glass-effect p-6 space-y-4 border-2 border-primary/30 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Generated Prompt
            </h3>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
          <div className="bg-background/50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
            <p className="whitespace-pre-wrap leading-relaxed">{generatedPrompt}</p>
          </div>
        </Card>
      )}
    </div>
  );
};