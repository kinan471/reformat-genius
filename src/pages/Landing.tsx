import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Video, MessageSquare, Globe, Check, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
              R
            </div>
            <span className="text-xl font-bold">RepurposeAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-6">
          AI-Powered Content Engine
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
          Repurpose Video into Viral Content
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Transform your videos, podcasts, and articles into 10 ready-to-publish formats. Save hours of content creation with AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-hero text-lg px-8 h-14">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:shadow-card-hover transition-all">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Video & Audio Support</CardTitle>
              <CardDescription>
                Upload MP4, MOV videos or MP3 audio files. AI transcribes and analyzes automatically.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-card-hover transition-all">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI Content Generation</CardTitle>
              <CardDescription>
                Generate 10 content formats: tweets, LinkedIn posts, Instagram carousels, and more.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-card-hover transition-all">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Multilingual Output</CardTitle>
              <CardDescription>
                Automatic language detection and generation in your content's native language.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <div className="text-4xl font-bold mt-4">$0</div>
              <CardDescription>Perfect for trying out</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>1 generation per day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>All 10 content formats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>History saved</span>
                </div>
              </div>
              <Link to="/signup" className="block">
                <Button className="w-full" variant="outline">Sign Up Free</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary shadow-card-hover relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-hero">Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle>Pro Plan</CardTitle>
              <div className="text-4xl font-bold mt-4">$19<span className="text-lg text-muted-foreground">/mo</span></div>
              <CardDescription>For content creators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Unlimited generations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>All 10 content formats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Full history access</span>
                </div>
              </div>
              <a 
                href="https://store.lemonsqueezy.com/checkout/buy/placeholder" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-gradient-hero">Subscribe Now</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 RepurposeAI. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;