import { Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      
      <div className="relative z-10 mx-auto max-w-4xl text-center animate-fade-in-up">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
          <Sparkles className="h-4 w-4" />
          AI-Powered Content Engine
        </div>
        
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Transform Your Content into{" "}
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            10 Formats
          </span>
        </h1>
        
        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Paste your text or upload audio/video. Our AI instantly creates viral hooks,
          social posts, scripts, and more — all optimized for maximum engagement.
        </p>
      </div>
    </section>
  );
};
