import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { drops, metrics } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate signature in a real app
    // const signature = req.headers.get("x-flowglad-signature");

    if (body.type === "payment.success") {
      const { productId } = body.data;

      // Find the drop
      const drop = await db.query.drops.findFirst({
        where: eq(drops.flowgladProductId, productId),
      });

      if (drop) {
        // 1. Decrement inventory
        // 2. Update status if sold out
        const newInventory = drop.inventoryCount - 1;
        const newStatus = newInventory <= 0 ? "sold_out" : drop.status;

        await db.update(drops)
          .set({ 
            inventoryCount: newInventory,
            status: newStatus
          })
          .where(eq(drops.id, drop.id));

        // 3. Update Metrics
        // Find or create metric
        let metric = await db.query.metrics.findFirst({
          where: eq(metrics.dropId, drop.id),
        });

        if (!metric) {
           [metric] = await db.insert(metrics).values({ dropId: drop.id }).returning();
        }

        await db.update(metrics)
          .set({
            sales: (metric?.sales || 0) + 1,
            // Assuming price is in cents, revenue matches
            revenue: (metric?.revenue || 0) + drop.price, 
            updatedAt: new Date(),
          })
          .where(eq(metrics.dropId, drop.id));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
