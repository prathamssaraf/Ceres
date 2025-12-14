/**
 * Script to update existing drops with new checkout functionality
 * Run with: npx tsx scripts/update-checkout.ts
 */

import { db } from "../src/db";
import { drops } from "../src/db/schema";
import { eq, isNotNull } from "drizzle-orm";

const oldHandleBuyFunction = `  <script>
    function handleBuy() {
      // This will be replaced with actual checkout logic
      alert('Checkout coming soon!');
    }
  </script>`;

const newHandleBuyFunction = `  <script>
    async function handleBuy() {
      const button = event.target.closest('button');
      const originalText = button.innerHTML;

      try {
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<svg class="w-6 h-6 animate-spin mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';

        // Extract slug from URL (/drop/[slug])
        const pathParts = window.location.pathname.split('/');
        const slug = pathParts[pathParts.length - 1];

        // Call checkout API
        const response = await fetch(\\\`/api/checkout/\\\${slug}\\\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success && data.checkoutUrl) {
          // Redirect to Flowglad checkout
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error(data.error || 'Failed to create checkout session');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Unable to proceed to checkout. Please try again.');
        button.disabled = false;
        button.innerHTML = originalText;
      }
    }
  </script>`;

async function updateDropsCheckout() {
  console.log("🔄 Starting checkout update for existing drops...");

  try {
    // Get all drops with custom HTML
    const allDrops = await db
      .select()
      .from(drops)
      .where(isNotNull(drops.customHtml));

    console.log(`📦 Found ${allDrops.length} drops with custom HTML`);

    let updatedCount = 0;

    for (const drop of allDrops) {
      if (!drop.customHtml) continue;

      // Check if it has the old handleBuy function
      if (drop.customHtml.includes("alert('Checkout coming soon!')")) {
        console.log(`  ➡️  Updating drop: ${drop.name} (${drop.slug})`);

        // Replace old function with new one
        const updatedHtml = drop.customHtml.replace(
          oldHandleBuyFunction,
          newHandleBuyFunction
        );

        // Update the database
        await db
          .update(drops)
          .set({ customHtml: updatedHtml })
          .where(eq(drops.id, drop.id));

        updatedCount++;
        console.log(`  ✅ Updated: ${drop.name}`);
      } else {
        console.log(`  ⏭️  Skipping: ${drop.name} (already has new checkout)`);
      }
    }

    console.log(`\n✨ Update complete! Updated ${updatedCount} drops.`);
  } catch (error) {
    console.error("❌ Error updating drops:", error);
    process.exit(1);
  }
}

// Run the update
updateDropsCheckout()
  .then(() => {
    console.log("✅ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
