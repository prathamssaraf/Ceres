/**
 * Script to fix template literal syntax in checkout function
 * Run with: npx tsx scripts/fix-checkout-syntax.ts
 */

import { db } from "../src/db";
import { drops } from "../src/db/schema";
import { eq, isNotNull } from "drizzle-orm";

async function fixCheckoutSyntax() {
  console.log("🔧 Fixing checkout syntax in existing drops...");

  try {
    // Get all drops with custom HTML
    const allDrops = await db
      .select()
      .from(drops)
      .where(isNotNull(drops.customHtml));

    console.log(`📦 Found ${allDrops.length} drops with custom HTML`);

    let fixedCount = 0;

    for (const drop of allDrops) {
      if (!drop.customHtml) continue;

      // Check if it has the broken template literal syntax
      if (drop.customHtml.includes('\\`/api/checkout/\\${slug}\\`')) {
        console.log(`  ➡️  Fixing drop: ${drop.name} (${drop.slug})`);

        // Fix the escaped template literals
        let fixedHtml = drop.customHtml;

        // Replace escaped backticks and template literal syntax
        fixedHtml = fixedHtml.replace(/\\`\/api\/checkout\/\\?\$\{slug\}\\`/g, '`/api/checkout/${slug}`');

        // Update the database
        await db
          .update(drops)
          .set({ customHtml: fixedHtml })
          .where(eq(drops.id, drop.id));

        fixedCount++;
        console.log(`  ✅ Fixed: ${drop.name}`);
      } else {
        console.log(`  ⏭️  Skipping: ${drop.name} (syntax already correct or different issue)`);
      }
    }

    console.log(`\n✨ Fix complete! Updated ${fixedCount} drops.`);
  } catch (error) {
    console.error("❌ Error fixing drops:", error);
    process.exit(1);
  }
}

// Run the fix
fixCheckoutSyntax()
  .then(() => {
    console.log("✅ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
