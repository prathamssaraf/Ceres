"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Check, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { DropData } from "@/app/onboarding/page";
import { useToast } from "@/components/ui/toast";
import { createDropWithVibe } from "@/app/actions/drops";

type PreviewStepProps = {
  dropData: DropData;
  updateDropData: (data: Partial<DropData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function PreviewStep({ dropData, onBack }: PreviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for the API
      const formData = new FormData();
      formData.append("name", dropData.name);
      formData.append("description", dropData.description || "");
      formData.append("price", dropData.price.toString());
      formData.append("vibe", dropData.vibePrompt);

      // Only send image URL if it's not a base64 data URL (too large for DB)
      // If it starts with 'http', it's from Uploadthing, otherwise use placeholder
      const imageUrl = dropData.imagePreview?.startsWith('http')
        ? dropData.imagePreview
        : 'https://placehold.co/600x400/png?text=Product+Image';
      formData.append("imageUrl", imageUrl);

      formData.append("inventory", dropData.inventory?.toString() || "0");

      // Call the real API
      const result = await createDropWithVibe(formData);

      if (result.success) {
        setIsSubmitting(false);
        setIsSuccess(true);
        showToast("Drop created successfully! 🎉", "success");

        // Redirect to dashboard after success
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1500);
      } else {
        throw new Error("Failed to create drop");
      }
    } catch (err) {
      setIsSubmitting(false);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
      setShowErrorDialog(true);
      showToast(errorMessage, "error");
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Drop Created!
        </h2>
        <p className="text-neutral-400">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Review Your Drop
        </h2>
        <p className="text-neutral-400">
          Everything look good? Let's launch it!
        </p>
      </div>

      {/* Preview Cards */}
      <div className="space-y-4">
        {/* Image Preview */}
        <Card className="bg-neutral-800/50 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={dropData.imagePreview}
                  alt={dropData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {dropData.name}
                </h3>
                <p className="text-neutral-400 text-sm mb-2">
                  {dropData.description}
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-neutral-600">
                    ${dropData.price}
                  </Badge>
                  <Badge variant="outline" className="border-neutral-600">
                    {dropData.inventory} units
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vibe Preview */}
        <Card className="bg-neutral-800/50 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-medium mb-1">The Vibe</h4>
                <p className="text-neutral-400 text-sm">
                  {dropData.vibePrompt}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          <strong>What happens next?</strong>
          <br />
          Our AI will generate a unique storefront matching your vibe. You'll
          be redirected to your dashboard where you can preview and publish
          your drop.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="border-neutral-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="bg-white text-black hover:bg-neutral-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Drop...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {error ? "Try Again" : "Create Drop"}
            </>
          )}
        </Button>
      </div>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="bg-neutral-900 border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5 text-red-400" />
              Oops! Something went wrong
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400">
              {error || "An unexpected error occurred. Please try again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowErrorDialog(false);
                handleSubmit();
              }}
              className="bg-white text-black hover:bg-neutral-200"
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
