import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, paddle-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Paddle webhook received:", JSON.stringify(body, null, 2));

    const eventType = body.event_type;
    const data = body.data;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract user_id from custom_data
    const userId = data?.custom_data?.user_id;

    if (!userId) {
      console.log("No user_id in custom_data, skipping");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing event ${eventType} for user ${userId}`);

    switch (eventType) {
      case "subscription.created":
      case "subscription.activated":
      case "subscription.resumed":
        // User subscribed - set is_pro to true
        const { error: activateError } = await supabaseAdmin
          .from("profiles")
          .update({ is_pro: true })
          .eq("id", userId);

        if (activateError) {
          console.error("Error activating pro:", activateError);
        } else {
          console.log(`User ${userId} upgraded to Pro`);
        }
        break;

      case "subscription.canceled":
      case "subscription.paused":
      case "subscription.past_due":
        // Subscription ended - set is_pro to false
        const { error: deactivateError } = await supabaseAdmin
          .from("profiles")
          .update({ is_pro: false })
          .eq("id", userId);

        if (deactivateError) {
          console.error("Error deactivating pro:", deactivateError);
        } else {
          console.log(`User ${userId} downgraded from Pro`);
        }
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
