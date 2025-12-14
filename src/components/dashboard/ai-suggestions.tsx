"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Share2,
  Percent,
  TrendingUp,
  Copy,
  Twitter,
  Instagram,
} from "lucide-react";
import { DashboardState } from "./status-card";

type AISuggestionsProps = {
  state: DashboardState;
  dropName: string;
  conversionRate: number;
};

export function AISuggestions({
  state,
  dropName,
  conversionRate,
}: AISuggestionsProps) {
  const suggestions = {
    hype: {
      title: "You're Crushing It! 🚀",
      message: "Inventory is flying. Start planning the sequel drop now while attention is high.",
      actions: [
        {
          label: "Plan Next Drop",
          icon: TrendingUp,
          variant: "default" as const,
        },
        {
          label: "Share Success",
          icon: Share2,
          variant: "outline" as const,
        },
      ],
      tips: [
        "Consider increasing inventory for future drops",
        "Capture customer emails for your next launch",
        "Document what's working for future campaigns",
      ],
    },
    quiet: {
      title: "Lots of Eyes, No Buys 👀",
      message: `${conversionRate.toFixed(1)}% conversion is low. The price might be too high for this vibe, or the vibe doesn't match expectations.`,
      actions: [
        {
          label: "Create 10% Discount",
          icon: Percent,
          variant: "default" as const,
        },
        {
          label: "Regenerate Vibe",
          icon: Sparkles,
          variant: "outline" as const,
        },
      ],
      tips: [
        "Test a time-limited discount (creates urgency)",
        "Try a different vibe that matches your product better",
        "Add more product details or better images",
        "Consider lowering the price point",
      ],
    },
    ghost: {
      title: "We Need Eyeballs 📣",
      message: "Low traffic means people don't know about your drop yet. Let's spread the word!",
      actions: [
        {
          label: "Copy Share Link",
          icon: Copy,
          variant: "default" as const,
        },
        {
          label: "Generate Tweet",
          icon: Twitter,
          variant: "outline" as const,
        },
      ],
      tips: [
        "Share on social media (Twitter, Instagram, TikTok)",
        "Post in relevant Discord/Telegram communities",
        "Ask friends to share your drop",
        "Consider running targeted ads",
      ],
      socialPosts: [
        `🔥 Just dropped: ${dropName}\n\nLimited stock. Don't sleep on this.\n\n[Your Drop Link]`,
        `New release alert 🚨\n\n${dropName} is live for a limited time.\n\nSecure yours before they're gone 👇`,
        `${dropName} just went live ✨\n\nLimited quantity. First come, first served.\n\nLink in bio 🔗`,
      ],
    },
  };

  const config = suggestions[state];

  return (
    <Card className="bg-neutral-900/50 border-neutral-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-white">AI Recommendations</CardTitle>
          <Badge variant="outline" className="ml-auto border-purple-500/50 text-purple-400">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{config.title}</h3>
          <p className="text-neutral-400 text-sm">{config.message}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          {config.actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                size="sm"
                className={
                  action.variant === "default"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-neutral-700"
                }
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>

        {/* Tips */}
        <div className="bg-neutral-800/50 rounded-lg p-4 space-y-2">
          <p className="text-xs text-neutral-400 uppercase tracking-wide font-semibold">
            Suggestions:
          </p>
          <ul className="space-y-1.5">
            {config.tips.map((tip, index) => (
              <li key={index} className="text-sm text-neutral-300 flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Posts for Ghost State */}
        {state === "ghost" && config.socialPosts && (
          <div className="space-y-2">
            <p className="text-xs text-neutral-400 uppercase tracking-wide font-semibold">
              Ready-to-Post Templates:
            </p>
            {config.socialPosts.map((post, index) => (
              <div
                key={index}
                className="bg-neutral-800/50 rounded-lg p-3 text-sm text-neutral-300 relative group cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <pre className="whitespace-pre-wrap font-sans">{post}</pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
