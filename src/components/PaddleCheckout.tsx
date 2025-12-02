import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Crown, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: string) => void;
      };
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          customData?: Record<string, string>;
          customer?: { email: string };
          settings?: { successUrl?: string };
        }) => void;
      };
      Initialized: boolean;
      Setup: (options: { token: string }) => void;
    };
  }
}

interface PaddleCheckoutProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export const PaddleCheckout = ({ 
  variant = "default", 
  size = "default", 
  className = "",
  children 
}: PaddleCheckoutProps) => {
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paddleReady, setPaddleReady] = useState(false);

  useEffect(() => {
    // Load Paddle script
    if (!document.getElementById("paddle-script")) {
      const script = document.createElement("script");
      script.id = "paddle-script";
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.onload = () => {
        if (window.Paddle) {
          // Using live environment
          window.Paddle.Environment.set("production");
          setPaddleReady(true);
        }
      };
      document.body.appendChild(script);
    } else if (window.Paddle) {
      setPaddleReady(true);
    }
  }, []);

  const handleCheckout = async () => {
    if (!user || !session) {
      toast.error("Please log in to subscribe");
      return;
    }

    if (!paddleReady || !window.Paddle) {
      toast.error("Payment system is loading, please try again");
      return;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("create-paddle-checkout", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { priceId, customData } = response.data;

      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData,
        customer: { email: user.email || "" },
        settings: {
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
        },
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to start checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCheckout}
      disabled={isLoading || !paddleReady}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        children || (
          <>
            <Crown className="h-4 w-4 mr-1" />
            Upgrade to Pro
          </>
        )
      )}
    </Button>
  );
};
