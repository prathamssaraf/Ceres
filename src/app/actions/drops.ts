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

import { createFlowgladProduct, createCheckoutSession } from "@/lib/flowglad";
import { generateVibe, generateCustomHTML } from "@/lib/ai/service";

export async function publishDrop(dropId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const drop = await db.query.drops.findFirst({
    where: eq(drops.id, dropId),
  });

  if (!drop) throw new Error("Drop not found");
  if (drop.userId !== userId) throw new Error("Unauthorized");

  // Create product in Flowglad
  const flowgladProduct = await createFlowgladProduct({
    name: drop.name,
    price: drop.price,
    slug: drop.slug || "",
  });

  // Update DB
  await db.update(drops)
    .set({
      status: "active",
      flowgladProductId: flowgladProduct.id,
    })
    .where(eq(drops.id, dropId));

  revalidatePath("/dashboard");
  return { success: true };
}

export async function generateCheckoutLink(dropId: number) {
  // Can be public or protected depending on flow. Assuming public for buyer.
  const drop = await db.query.drops.findFirst({
    where: eq(drops.id, dropId),
  });

  if (!drop || drop.status !== "active" || !drop.flowgladProductId) {
    throw new Error("Drop not available for purchase");
  }

  // Generate session
  // We need a success URL. For now, localhost or generic.
  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/drop/${drop.slug}/success`;
  
  const session = await createCheckoutSession(drop.flowgladProductId, successUrl);
  return { url: session.url };
}

export async function createDropWithVibe(formData: FormData) {
  const { userId } = await auth();

  // For demo purposes, allow demo user if not authenticated
  // In production, you'd want to enforce auth
  const finalUserId = userId || "demo-user";

  const nam = formData.get("name") as string;
  const desc = formData.get("description") as string;
  const priceInDollars = Number(formData.get("price"));
  const price = Math.round(priceInDollars * 100); // Convert dollars to cents
  const vibe = formData.get("vibe") as string;
  const imgUrl = formData.get("imageUrl") as string;
  const inv = Number(formData.get("inventory"));

  if (!nam || !price || !vibe) throw new Error("Missing fields");

  // 1. Generate Vibe Config using AI (for backward compatibility)
  const vibeConfig = await generateVibe(nam, vibe);

  // 2. Generate Custom HTML using Claude
  const customHtml = await generateCustomHTML({
    name: nam,
    description: desc || "Premium quality product",
    price: price,
    inventoryCount: inv,
    vibePrompt: vibe,
    imageUrl: imgUrl,
  });

  // 3. Create DB Entry
  const slug = nam.toLowerCase().replace(/ /g, "-") + "-" + Date.now().toString().slice(-4);

  const [newDrop] = await db.insert(drops).values({
    name: nam,
    description: desc,
    price: price, // stored in cents
    inventoryCount: inv,
    vibePrompt: vibe,
    imageUrl: imgUrl,
    generatedUiConfig: vibeConfig,
    customHtml: customHtml,
    slug,
    status: "draft",
    userId: userId,
  }).returning();

  // 4. Create Flowglad Product
  try {
     const flowgladProduct = await createFlowgladProduct({
      name: nam,
      price: price,
      slug: slug,
    });

    // Update with Flowglad ID and set to active
    await db.update(drops)
      .set({
        flowgladProductId: flowgladProduct.id,
        status: "active"
      })
      .where(eq(drops.id, newDrop.id));

  } catch (e) {
    console.error("Flowglad creation failed", e);
    // Don't fail the whole request, just leave as draft
  }

  revalidatePath("/dashboard");
  return { success: true, slug };
}
