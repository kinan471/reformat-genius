import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Crown, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { PaddleCheckout } from "@/components/PaddleCheckout";

export const DashboardHeader = () => {
  const { signOut, profile } = useAuth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold">
            R
          </div>
          <span className="text-xl font-bold">RepurposeAI</span>
        </div>
        
        <div className="flex items-center gap-4">
          {profile?.is_pro ? (
            <Badge className="bg-gradient-hero">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {profile?.trial_generations_used || 0}/1 free generations used
              </span>
              <PaddleCheckout size="sm" className="bg-gradient-hero" />
            </div>
          )}
          
          <Link to="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};