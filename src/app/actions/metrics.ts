"use server";

import { db } from "@/db";
import { metrics, drops } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getDropMetrics(dropId: number) {
  const [metric] = await db.select().from(metrics).where(eq(metrics.dropId, dropId));
  
  return metric || { views: 0, sales: 0, revenue: 0 };
}

export async function getMyDrops() {
  const { userId } = await auth();
  if (!userId) return [];

  const myDrops = await db.select().from(drops).where(eq(drops.userId, userId)).orderBy(desc(drops.createdAt));
  return myDrops;
}
