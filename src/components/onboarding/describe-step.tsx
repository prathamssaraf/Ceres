"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check } from "lucide-react";
import { DropData } from "@/app/onboarding/page";

type DescribeStepProps = {
  dropData: DropData;
  updateDropData: (data: Partial<DropData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export function DescribeStep({
  dropData,
  updateDropData,
  onNext,
  onBack,
}: DescribeStepProps) {
  const handleNext = () => {
    if (
      dropData.name &&
      dropData.price &&
      dropData.inventory &&
      dropData.description
    ) {
      onNext();
    }
  };

  const isValid =
    dropData.name &&
    dropData.price &&
    dropData.inventory &&
    dropData.description;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Describe Your Drop
        </h2>
        <p className="text-neutral-400">Tell us about your product</p>
        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge
            variant={dropData.name ? "default" : "outline"}
            className={
              dropData.name
                ? "bg-green-500/20 text-green-400 border-green-500/50"
                : "border-neutral-700 text-neutral-500"
            }
          >
            {dropData.name && <Check className="h-3 w-3 mr-1" />}
            Name
          </Badge>
          <Badge
            variant={dropData.description ? "default" : "outline"}
            className={
              dropData.description
                ? "bg-green-500/20 text-green-400 border-green-500/50"
                : "border-neutral-700 text-neutral-500"
            }
          >
            {dropData.description && <Check className="h-3 w-3 mr-1" />}
            Description
          </Badge>
          <Badge
            variant={dropData.price ? "default" : "outline"}
            className={
              dropData.price
                ? "bg-green-500/20 text-green-400 border-green-500/50"
                : "border-neutral-700 text-neutral-500"
            }
          >
            {dropData.price && <Check className="h-3 w-3 mr-1" />}
            Price
          </Badge>
          <Badge
            variant={dropData.inventory ? "default" : "outline"}
            className={
              dropData.inventory
                ? "bg-green-500/20 text-green-400 border-green-500/50"
                : "border-neutral-700 text-neutral-500"
            }
          >
            {dropData.inventory && <Check className="h-3 w-3 mr-1" />}
            Stock
          </Badge>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Product Name
          </Label>
          <Input
            id="name"
            placeholder="e.g., Limited Edition Hoodie"
            value={dropData.name}
            onChange={(e) => updateDropData({ name: e.target.value })}
            className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="e.g., Hand-crafted premium cotton hoodie with exclusive design"
            value={dropData.description}
            onChange={(e) => updateDropData({ description: e.target.value })}
            className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 min-h-[100px] resize-none"
            maxLength={200}
          />
          <p className="text-xs text-neutral-500 text-right">
            {dropData.description.length}/200
          </p>
        </div>

        {/* Price and Inventory */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">
              Price (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                $
              </span>
              <Input
                id="price"
                type="number"
                placeholder="65"
                value={dropData.price}
                onChange={(e) => updateDropData({ price: e.target.value })}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 pl-8"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory" className="text-white">
              Inventory
            </Label>
            <Input
              id="inventory"
              type="number"
              placeholder="50"
              value={dropData.inventory}
              onChange={(e) => updateDropData({ inventory: e.target.value })}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              min="1"
            />
          </div>
        </div>
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
          disabled={!isValid}
          size="lg"
          className="bg-white text-black hover:bg-neutral-200"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
