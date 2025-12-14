"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusCard, DashboardState } from "@/components/dashboard/status-card";
import { AISuggestions } from "@/components/dashboard/ai-suggestions";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { getMyDrops, getDropMetrics } from "@/app/actions/metrics";
import {
  ExternalLink,
  Copy,
  Check,
  BarChart3,
  Package,
  Clock,
} from "lucide-react";

// Mock data - will be replaced with actual API calls
const MOCK_DROP = {
  id: 1,
  name: "Limited Edition Hoodie",
  description: "Premium cotton hoodie with exclusive design",
  price: 6500, // in cents
  inventoryCount: 50,
  inventoryRemaining: 32,
  vibePrompt: "Cyberpunk Tokyo rain, neon-lit streets, futuristic aesthetic",
  status: "active",
  slug: "limited-edition-hoodie-x7k2",
  createdAt: new Date(),
};

const MOCK_METRICS = {
  views: 1247,
  sales: 18,
  revenue: 117000, // in cents
};

function calculateDashboardState(
  views: number,
  sales: number
): DashboardState {
  const conversionRate = views > 0 ? (sales / views) * 100 : 0;

  // Hype State: High sales OR high conversion
  if (sales >= 10 || conversionRate >= 3) {
    return "hype";
  }

  // Quiet State: High views but low conversion
  if (views >= 100 && conversionRate < 2) {
    return "quiet";
  }

  // Ghost State: Low traffic
  return "ghost";
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [drop, setDrop] = useState(MOCK_DROP);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate state and conversion rate
  const dashboardState = calculateDashboardState(metrics.views, metrics.sales);
  const conversionRate =
    metrics.views > 0 ? (metrics.sales / metrics.views) * 100 : 0;
  const dropUrl = `https://flashdrop.xyz/drop/${drop.slug}`;

  // Fetch real data from API
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);

        // Fetch user's drops
        const drops = await getMyDrops();

        if (drops && drops.length > 0) {
          // Use the most recent drop
          const latestDrop = drops[0];
          setDrop({
            id: latestDrop.id,
            name: latestDrop.name,
            description: latestDrop.description || "",
            price: latestDrop.price,
            inventoryCount: latestDrop.inventoryCount,
            inventoryRemaining: latestDrop.inventoryCount, // TODO: Track actual remaining
            vibePrompt: latestDrop.vibePrompt,
            status: latestDrop.status || "draft",
            slug: latestDrop.slug || "",
            createdAt: latestDrop.createdAt || new Date(),
          });

          // Fetch metrics for this drop
          const dropMetrics = await getDropMetrics(latestDrop.id);
          setMetrics({
            views: dropMetrics.views || 0,
            sales: dropMetrics.sales || 0,
            revenue: dropMetrics.revenue || 0,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();

    // Set up real-time updates every 10 seconds
    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dropUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-neutral-400">
              Real-time insights for your drops
            </p>
          </div>
          <Button
            variant="outline"
            className="border-neutral-700"
            onClick={() => (window.location.href = "/onboarding")}
          >
            <Package className="mr-2 h-4 w-4" />
            New Drop
          </Button>
        </div>

        {/* Status Card */}
        <StatusCard
          dropName={drop.name}
          views={metrics.views}
          sales={metrics.sales}
          revenue={metrics.revenue}
          conversionRate={conversionRate}
          state={dashboardState}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Drop Details & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drop Details */}
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-white">Drop Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <Badge
                      variant="outline"
                      className="border-green-500/50 text-green-400"
                    >
                      {drop.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                      Price
                    </p>
                    <p className="text-white font-semibold">
                      ${(drop.price / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                      Inventory
                    </p>
                    <p className="text-white font-semibold">
                      {drop.inventoryRemaining} / {drop.inventoryCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                      Created
                    </p>
                    <p className="text-white font-semibold">
                      {new Date(drop.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">
                    Vibe
                  </p>
                  <p className="text-neutral-300 text-sm bg-neutral-800/50 rounded-lg p-3">
                    {drop.vibePrompt}
                  </p>
                </div>

                {/* Drop Link */}
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-2">
                    Drop Link
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={dropUrl}
                      readOnly
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-300"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="border-neutral-700"
                    >
                      {copiedLink ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-neutral-700"
                      onClick={() => window.open(dropUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart Placeholder */}
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-neutral-400" />
                  <CardTitle className="text-white">
                    Performance Over Time
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-neutral-800 rounded-lg">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-neutral-700 mx-auto mb-2" />
                    <p className="text-neutral-500 text-sm">
                      Chart visualization coming soon
                    </p>
                    <p className="text-neutral-600 text-xs">
                      Track views and sales over time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Suggestions */}
          <div className="lg:col-span-1">
            <AISuggestions
              state={dashboardState}
              dropName={drop.name}
              conversionRate={conversionRate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
