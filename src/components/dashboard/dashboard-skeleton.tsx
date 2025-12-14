"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48 mb-2 bg-neutral-800" />
            <Skeleton className="h-5 w-64 bg-neutral-800" />
          </div>
          <Skeleton className="h-10 w-32 bg-neutral-800" />
        </div>

        {/* Status Card Skeleton */}
        <Card className="bg-neutral-900/50 border-neutral-800">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64 bg-neutral-800" />
                <Skeleton className="h-6 w-40 bg-neutral-800" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-neutral-800" />
                  <Skeleton className="h-8 w-24 bg-neutral-800" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drop Details Skeleton */}
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-neutral-800" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-16 bg-neutral-800" />
                      <Skeleton className="h-5 w-24 bg-neutral-800" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12 bg-neutral-800" />
                  <Skeleton className="h-20 w-full bg-neutral-800" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16 bg-neutral-800" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 bg-neutral-800" />
                    <Skeleton className="h-10 w-10 bg-neutral-800" />
                    <Skeleton className="h-10 w-10 bg-neutral-800" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Chart Skeleton */}
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-neutral-800" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full bg-neutral-800" />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Suggestions Skeleton */}
          <div className="lg:col-span-1">
            <Card className="bg-neutral-900/50 border-neutral-800">
              <CardHeader>
                <Skeleton className="h-6 w-40 bg-neutral-800" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full bg-neutral-800" />
                  <Skeleton className="h-4 w-full bg-neutral-800" />
                  <Skeleton className="h-4 w-3/4 bg-neutral-800" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24 bg-neutral-800" />
                  <Skeleton className="h-8 w-24 bg-neutral-800" />
                </div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full bg-neutral-800" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
