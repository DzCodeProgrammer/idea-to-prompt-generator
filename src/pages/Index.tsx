import { useState } from "react";
import { PromptGenerator } from "@/components/PromptGenerator";
import { PromptHistory } from "@/components/PromptHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HistoryItem {
  id: string;
  topic: string;
  category: string;
  prompt: string;
  timestamp: Date;
}

const Index = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const handlePromptGenerated = (prompt: string, topic: string, category: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      topic,
      category,
      prompt,
      timestamp: new Date(),
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 10)); // Keep last 10 items
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background with Hero Image */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-10"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-primary glow-effect">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  PromptForge
                </h1>
                <p className="text-xs text-muted-foreground">Turn Your Ideas Into Perfect Prompts</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generator Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Generate Perfect Prompts with AI
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transform your ideas into high-quality, detailed prompts for any purpose - coding, design, business, or creative projects
              </p>
            </div>
            <PromptGenerator onPromptGenerated={handlePromptGenerated} />
          </div>

          {/* History Sidebar - Takes 1 column on large screens */}
          <div className="lg:sticky lg:top-24 h-[600px]">
            <PromptHistory 
              history={history} 
              onSelectPrompt={setSelectedPrompt}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 PromptForge AI — Crafted with{" "}
            <span className="text-blue-500">💙</span> by{" "}
            <a 
              href="https://lovable.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold hover:text-primary transition-colors"
            >
              Lovable
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;