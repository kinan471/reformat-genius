import { useState, useEffect } from "react";
import { ContentInput } from "@/components/ContentInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { GenerationHistory } from "@/components/GenerationHistory";
import { DashboardHeader } from "@/components/DashboardHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setHistory(data);
    }
  };

  const handleGenerate = async (content: string, meta?: { language?: string; tone?: string }) => {
    if (!user || !profile) return;

    // Check usage limits
    if (!profile.is_pro && profile.trial_generations_used >= 1) {
      toast({
        title: "Free limit reached",
        description: "Upgrade to Pro for unlimited generations",
        variant: "destructive",
      });
      return;
    }

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

      // Save to database
      await supabase.from("generations").insert({
        user_id: user.id,
        input_type: "text",
        input_content: content,
        output_data: data,
      });

      // Update trial counter if not pro
      if (!profile.is_pro) {
        await supabase
          .from("profiles")
          .update({ trial_generations_used: profile.trial_generations_used + 1 })
          .eq("id", user.id);
        
        await refreshProfile();
      }

      // Refresh history
      await loadHistory();

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

  const handleLoadHistory = (item: any) => {
    setResults(item.output_data);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <GenerationHistory history={history} onLoad={handleLoadHistory} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <ContentInput onGenerate={handleGenerate} isLoading={isLoading} />
            {results && <ResultsDisplay results={results} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;