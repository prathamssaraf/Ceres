import { pgTable, text, serial, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const drops = pgTable("drops", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Clerk ID
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // stored in cents
  inventoryCount: integer("inventory_count").notNull(),
  vibePrompt: text("vibe_prompt").notNull(),
  generatedUiConfig: jsonb("generated_ui_config"),
  customHtml: text("custom_html"), // AI-generated custom HTML for the drop page
  status: text("status").default("draft"), // draft, active, sold_out
  imageUrl: text("image_url"),
  flowgladProductId: text("flowglad_product_id"),
  slug: text("slug").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  dropId: integer("drop_id").references(() => drops.id),
  views: integer("views").default(0),
  sales: integer("sales").default(0),
  revenue: integer("revenue").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});
