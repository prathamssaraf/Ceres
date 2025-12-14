"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Sparkles,
  Eye,
} from "lucide-react";

export type DashboardState = "hype" | "quiet" | "ghost";

type StatusCardProps = {
  dropName: string;
  views: number;
  sales: number;
  revenue: number;
  conversionRate: number;
  state: DashboardState;
};

export function StatusCard({
  dropName,
  views,
  sales,
  revenue,
  conversionRate,
  state,
}: StatusCardProps) {
  const stateConfig = {
    hype: {
      gradient: "from-green-500/20 via-yellow-500/20 to-green-500/20",
      border: "border-green-500/50",
      badge: { variant: "default" as const, text: "CRUSHING IT", icon: Sparkles },
      accentColor: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    quiet: {
      gradient: "from-orange-500/20 via-yellow-500/20 to-orange-500/20",
      border: "border-orange-500/50",
      badge: { variant: "outline" as const, text: "NEEDS OPTIMIZATION", icon: AlertCircle },
      accentColor: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    ghost: {
      gradient: "from-neutral-800 via-neutral-900 to-neutral-800",
      border: "border-neutral-700",
      badge: { variant: "outline" as const, text: "LOW TRAFFIC", icon: Eye },
      accentColor: "text-neutral-400",
      bgColor: "bg-neutral-500/10",
    },
  };

  const config = stateConfig[state];
  const BadgeIcon = config.badge.icon;

  return (
    <Card
      className={`bg-gradient-to-br ${config.gradient} border-2 ${config.border} relative overflow-hidden`}
    >
      {/* Animated background effect for Hype state */}
      {state === "hype" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl text-white mb-2">
              {dropName}
            </CardTitle>
            <Badge
              variant={config.badge.variant}
              className={`${config.bgColor} ${config.accentColor} border-none`}
            >
              <BadgeIcon className="h-3 w-3 mr-1" />
              {config.badge.text}
            </Badge>
          </div>
          {state === "hype" && (
            <div className="text-4xl animate-pulse">🔥</div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Views */}
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 uppercase tracking-wide">
              Views
            </p>
            <p className={`text-2xl font-bold ${config.accentColor}`}>
              {views.toLocaleString()}
            </p>
          </div>

          {/* Sales */}
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 uppercase tracking-wide">
              Sales
            </p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${config.accentColor}`}>
                {sales.toLocaleString()}
              </p>
              {state === "hype" && (
                <TrendingUp className="h-4 w-4 text-green-400" />
              )}
              {state === "quiet" && (
                <TrendingDown className="h-4 w-4 text-orange-400" />
              )}
            </div>
          </div>

          {/* Revenue */}
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 uppercase tracking-wide">
              Revenue
            </p>
            <p className={`text-2xl font-bold ${config.accentColor}`}>
              ${(revenue / 100).toFixed(2)}
            </p>
          </div>

          {/* Conversion */}
          <div className="space-y-1">
            <p className="text-xs text-neutral-400 uppercase tracking-wide">
              Conversion
            </p>
            <p className={`text-2xl font-bold ${config.accentColor}`}>
              {conversionRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
