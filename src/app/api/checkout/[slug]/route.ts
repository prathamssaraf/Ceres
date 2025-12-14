import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { drops } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateCheckoutLink } from "@/app/actions/drops";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Find the drop by slug
    const drop = await db.query.drops.findFirst({
      where: eq(drops.slug, slug),
    });

    if (!drop) {
      return NextResponse.json(
        { error: "Drop not found" },
        { status: 404 }
      );
    }

    // Check if drop is active and has a Flowglad product ID
    if (drop.status !== "active") {
      return NextResponse.json(
        { error: "Drop is not active" },
        { status: 400 }
      );
    }

    if (!drop.flowgladProductId) {
      return NextResponse.json(
        { error: "Drop is not available for purchase" },
        { status: 400 }
      );
    }

    // Generate checkout link
    const { url } = await generateCheckoutLink(drop.id);

    return NextResponse.json({
      success: true,
      checkoutUrl: url
    });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
