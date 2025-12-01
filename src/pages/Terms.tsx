import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-2 shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using RepurposeAI, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use RepurposeAI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2>3. Service Description</h2>
            <p>
              RepurposeAI provides AI-powered content repurposing services. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
            </p>

            <h2>4. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>

            <h2>5. Content Ownership</h2>
            <p>
              You retain all rights to the content you upload. By using our service, you grant us a license to process and generate derivative works for the purpose of providing our services.
            </p>

            <h2>6. Payment Terms</h2>
            <p>
              Subscription fees are billed in advance on a monthly basis. All fees are non-refundable unless otherwise stated.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              RepurposeAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
            </p>

            <h2>9. Contact Information</h2>
            <p>
              For any questions about these Terms, please contact us at support@repurposeai.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;