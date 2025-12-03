import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, paddle-signature",
};

// Verify Paddle webhook signature
async function verifyPaddleSignature(
  rawBody: string,
  signature: string | null,
  secretKey: string
): Promise<boolean> {
  if (!signature) {
    console.error("Missing Paddle-Signature header");
    return false;
  }

  try {
    // Parse the signature header: ts=timestamp;h1=hash
    const parts = signature.split(";");
    const tsMatch = parts.find((p) => p.startsWith("ts="));
    const h1Match = parts.find((p) => p.startsWith("h1="));

    if (!tsMatch || !h1Match) {
      console.error("Invalid signature format");
      return false;
    }

    const timestamp = tsMatch.split("=")[1];
    const expectedHash = h1Match.split("=")[1];

    // Build the signed payload: timestamp:rawBody
    const signedPayload = `${timestamp}:${rawBody}`;

    // Compute HMAC-SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const messageData = encoder.encode(signedPayload);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const computedHash = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Compare hashes (timing-safe comparison)
    if (computedHash.length !== expectedHash.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash.charCodeAt(i) ^ expectedHash.charCodeAt(i);
    }

    return result === 0;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Verify signature
    const paddleSignature = req.headers.get("paddle-signature");
    const webhookSecret = Deno.env.get("PADDLE_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("PADDLE_WEBHOOK_SECRET not configured");
      return new Response(JSON.stringify({ error: "Webhook not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isValid = await verifyPaddleSignature(rawBody, paddleSignature, webhookSecret);
    
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Webhook signature verified successfully");

    // Parse the verified body
    const body = JSON.parse(rawBody);
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
