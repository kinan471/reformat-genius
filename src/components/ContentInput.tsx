import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentInputProps {
  onGenerate: (content: string, meta?: { language?: string; tone?: string }) => void;
  isLoading: boolean;
}

export const ContentInput = ({ onGenerate, isLoading }: ContentInputProps) => {
  const [textContent, setTextContent] = useState("");
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!textContent.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content to repurpose",
        variant: "destructive",
      });
      return;
    }

    onGenerate(textContent, {
      language: "auto",
      tone: "professional",
    });
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <Card className="border-2 shadow-card transition-shadow hover:shadow-card-hover">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Your Content
            </Label>
            <Textarea
              id="content"
              placeholder="Paste your blog post, article, transcript, or any content you want to repurpose..."
              className="min-h-[200px] resize-none text-base"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !textContent.trim()}
              className="flex-1 h-12 text-base font-semibold bg-gradient-hero hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate 10 Formats
                </>
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Tip: The more detailed your content, the better the AI-generated outputs
          </p>
        </CardContent>
      </Card>
    </section>
  );
};
