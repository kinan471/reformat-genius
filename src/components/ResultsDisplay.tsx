import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Linkedin, Twitter, Instagram, Youtube, Hash, Target } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RepurposedContent {
  meta: {
    input_type: string;
    detected_language: string;
    summary: string;
    timestamp_generated: string;
  };
  outputs: {
    viral_hook: { text: string; length_chars: number };
    headlines: Array<{ title: string; score: number }>;
    linkedin_post: { text: string; length_chars: number };
    twitter_thread: { tweets: string[]; total_tweets: number };
    instagram_carousel: {
      slides: Array<{ headline: string; body: string; visual_note: string }>;
      total_slides: number;
    };
    instagram_reel_script: { script: string; time_seconds: number };
    youtube_description: {
      description: string;
      seo_keywords: string[];
      hashtags: string[];
    };
    tiktok_script: { script: string; time_seconds: number };
    hashtags: {
      tags: string[];
      platform_scores: { instagram: number; tiktok: number; linkedin: number };
    };
    cta: { text: string; type: string };
  };
}

interface ResultsDisplayProps {
  results: RepurposedContent;
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const CopyButton = ({ text, id }: { text: string; id: string }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, id)}
      className="h-8"
    >
      {copiedId === id ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-8 animate-fade-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Your Repurposed Content</h2>
        <p className="text-muted-foreground">{results.meta.summary}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Viral Hook */}
        <Card className="shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Viral Hook
              </span>
              <CopyButton text={results.outputs.viral_hook.text} id="viral-hook" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{results.outputs.viral_hook.text}</p>
            <Badge variant="secondary" className="mt-3">
              {results.outputs.viral_hook.length_chars} characters
            </Badge>
          </CardContent>
        </Card>

        {/* Headlines */}
        <Card className="shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              Top 5 Headlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.outputs.headlines.map((headline, idx) => (
              <div key={idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-accent/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{headline.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{headline.score}</Badge>
                  <CopyButton text={headline.title} id={`headline-${idx}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* LinkedIn Post */}
        <Card className="shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-primary" />
                LinkedIn Post
              </span>
              <CopyButton text={results.outputs.linkedin_post.text} id="linkedin" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {results.outputs.linkedin_post.text}
            </p>
            <Badge variant="secondary" className="mt-3">
              {results.outputs.linkedin_post.length_chars} characters
            </Badge>
          </CardContent>
        </Card>

        {/* Twitter Thread */}
        <Card className="shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Twitter className="h-5 w-5 text-primary" />
                Twitter Thread
              </span>
              <CopyButton
                text={results.outputs.twitter_thread.tweets.join("\n\n")}
                id="twitter"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.outputs.twitter_thread.tweets.map((tweet, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-accent/50">
                <div className="flex items-start gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {idx + 1}/{results.outputs.twitter_thread.total_tweets}
                  </Badge>
                </div>
                <p className="text-sm">{tweet}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Instagram Carousel */}
        <Card className="md:col-span-2 shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-primary" />
                Instagram Carousel (5 Slides)
              </span>
              <CopyButton
                text={results.outputs.instagram_carousel.slides
                  .map((s, i) => `Slide ${i + 1}:\n${s.headline}\n${s.body}\nVisual: ${s.visual_note}`)
                  .join("\n\n")}
                id="instagram-carousel"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {results.outputs.instagram_carousel.slides.map((slide, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gradient-card border">
                  <Badge className="mb-2">Slide {idx + 1}</Badge>
                  <h4 className="font-semibold mb-2">{slide.headline}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{slide.body}</p>
                  <p className="text-xs text-primary italic">💡 {slide.visual_note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instagram Reel Script */}
        <Card className="shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-primary" />
                Instagram Reel Script
              </span>
              <CopyButton text={results.outputs.instagram_reel_script.script} id="reel" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {results.outputs.instagram_reel_script.script}
            </p>
            <Badge variant="secondary" className="mt-3">
              {results.outputs.instagram_reel_script.time_seconds}s script
            </Badge>
          </CardContent>
        </Card>

        {/* TikTok Script */}
        <Card className="shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
                TikTok Script
              </span>
              <CopyButton text={results.outputs.tiktok_script.script} id="tiktok" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {results.outputs.tiktok_script.script}
            </p>
            <Badge variant="secondary" className="mt-3">
              {results.outputs.tiktok_script.time_seconds}s script
            </Badge>
          </CardContent>
        </Card>

        {/* YouTube Description */}
        <Card className="md:col-span-2 shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-primary" />
                YouTube Description
              </span>
              <CopyButton
                text={`${results.outputs.youtube_description.description}\n\nKeywords: ${results.outputs.youtube_description.seo_keywords.join(
                  ", "
                )}\n\n${results.outputs.youtube_description.hashtags.join(" ")}`}
                id="youtube"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {results.outputs.youtube_description.description}
            </p>
            <div>
              <h4 className="text-sm font-semibold mb-2">SEO Keywords:</h4>
              <div className="flex flex-wrap gap-2">
                {results.outputs.youtube_description.seo_keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Hashtags:</h4>
              <p className="text-sm text-primary">
                {results.outputs.youtube_description.hashtags.join(" ")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Hashtags */}
        <Card className="shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Platform Hashtags
              </span>
              <CopyButton text={results.outputs.hashtags.tags.join(" ")} id="hashtags" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {results.outputs.hashtags.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-primary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-2 pt-3 border-t">
              <h4 className="text-sm font-semibold">Platform Scores:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Instagram:</span>
                  <Badge variant="secondary">{results.outputs.hashtags.platform_scores.instagram}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>TikTok:</span>
                  <Badge variant="secondary">{results.outputs.hashtags.platform_scores.tiktok}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>LinkedIn:</span>
                  <Badge variant="secondary">{results.outputs.hashtags.platform_scores.linkedin}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="shadow-card hover:shadow-card-hover transition-all">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Call to Action
              </span>
              <CopyButton text={results.outputs.cta.text} id="cta" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-foreground leading-relaxed">{results.outputs.cta.text}</p>
            <Badge variant="outline">{results.outputs.cta.type}</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
