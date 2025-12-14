"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import { DropData } from "@/app/onboarding/page";

type VibeStepProps = {
  dropData: DropData;
  updateDropData: (data: Partial<DropData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const VIBE_PRESETS = [
  {
    label: "Cyberpunk Tokyo",
    prompt: "Neon-lit streets, futuristic Tokyo rain, dark cyber aesthetic",
  },
  {
    label: "Minimalist Luxury",
    prompt: "Clean lines, premium materials, understated elegance",
  },
  {
    label: "Retro 90s",
    prompt: "Bold colors, nostalgic vibes, vintage aesthetic",
  },
  {
    label: "Cozy Grandmacore",
    prompt: "Warm, comforting, handcrafted cottage aesthetic",
  },
  {
    label: "Street Hype",
    prompt: "Urban energy, streetwear culture, bold statements",
  },
  {
    label: "Dark Academia",
    prompt: "Classic literature, moody lighting, intellectual aesthetic",
  },
];

export function VibeStep({
  dropData,
  updateDropData,
  onNext,
  onBack,
}: VibeStepProps) {
  const handleNext = () => {
    if (dropData.vibePrompt.trim()) {
      onNext();
    }
  };

  const handlePresetClick = (prompt: string) => {
    updateDropData({ vibePrompt: prompt });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-semibold text-white">Set the Vibe</h2>
        </div>
        <p className="text-neutral-400">
          Describe the aesthetic and feeling of your drop
        </p>
      </div>

      {/* Vibe Presets */}
      <div className="space-y-3">
        <p className="text-sm text-neutral-400">Try a preset:</p>
        <div className="flex flex-wrap gap-2">
          {VIBE_PRESETS.map((preset) => (
            <Badge
              key={preset.label}
              variant={
                dropData.vibePrompt === preset.prompt ? "default" : "outline"
              }
              className={`cursor-pointer transition-all ${
                dropData.vibePrompt === preset.prompt
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              }`}
              onClick={() => handlePresetClick(preset.prompt)}
            >
              {preset.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Custom Vibe Input */}
      <div className="space-y-3">
        <p className="text-sm text-neutral-400">Or create your own:</p>
        <Textarea
          placeholder="e.g., 'Matrix-style green terminals with rain effects' or 'Warm sunset gradient with handwritten typography'"
          value={dropData.vibePrompt}
          onChange={(e) => updateDropData({ vibePrompt: e.target.value })}
          className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 min-h-[120px] resize-none"
          maxLength={300}
        />
        <p className="text-xs text-neutral-500 text-right">
          {dropData.vibePrompt.length}/300
        </p>
      </div>

      {/* Examples Section */}
      <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
        <p className="text-xs text-neutral-400 mb-2">
          💡 <strong>Examples:</strong>
        </p>
        <ul className="text-xs text-neutral-500 space-y-1">
          <li>• "Spicy chili pepper red with flames and bold typography"</li>
          <li>
            • "Soft pastel clouds, dreamy atmosphere, gentle animations"
          </li>
          <li>• "Industrial concrete, raw textures, monochrome palette"</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-neutral-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!dropData.vibePrompt.trim()}
          size="lg"
          className="bg-white text-black hover:bg-neutral-200"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
