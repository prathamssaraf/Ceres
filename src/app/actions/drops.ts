"use server";

import { db } from "@/db";
import { drops } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createDrop(data: {
  name: string;
  description: string;
  price: number;
  inventoryCount: number;
  vibePrompt: string;
  imageUrl: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // TODO: In a real app, mapping Clerk IDs to DB IDs would be needed.
  // For now we assume we might need to create/find the user.
  // This is a simplified hackathon version.

  const slug = data.name.toLowerCase().replace(/ /g, "-") + "-" + Date.now().toString().slice(-4);

  const [newDrop] = await db.insert(drops).values({
    ...data,
    slug,
    status: "draft",
    userId: userId,
  }).returning();

  revalidatePath("/dashboard");
  return newDrop;
}

export async function getDropBySlug(slug: string) {
  const drop = await db.query.drops.findFirst({
    where: eq(drops.slug, slug),
  });
  return drop;
}
