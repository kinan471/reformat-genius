import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ContentInput } from "@/components/ContentInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async (content: string, meta?: { language?: string; tone?: string }) => {
    setIsLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("repurpose-content", {
        body: {
          text_content: content,
          meta: meta || {},
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      toast({
        title: "Success!",
        description: "Your content has been repurposed into 10 formats",
      });
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ContentInput onGenerate={handleGenerate} isLoading={isLoading} />
      {results && <ResultsDisplay results={results} />}
    </div>
  );
};

export default Index;
