# Flash-Drop Task List

## Phase 1: Core Infrastructure (Team B)
- [x] **Project Setup**
    - [x] Initialize Next.js 14 project (App Router, TypeScript, Tailwind)
    - [x] Set up Shadcn/UI for "Admin" components
    - [x] Configure PostgreSQL database (Supabase or Neon)
    - [x] Set up Prisma/Drizzle ORM
- [x] **Database Schema Design**
    - [x] Define `User` (Seller) table
    - [x] Define `Drop` table (product details, vibe prompt, generated_ui_config, status)
    - [x] Define `Metric` table (visits, sales, conversion_rate)
- [x] **Authentication**
    - [x] Implement Clerk or NextAuth for Seller Login
- [x] **API Layer**
    - [x] Create TRPC or Next.js Server Actions for CRUD on Drops

## Phase 2: The "Vibe Engine" (Team A)
- [ ] **AI Generation Service**
    - [ ] Set up OpenAI API / Anthropic SDK
    - [ ] Create `generateVibe` function: Input (Product, Vibe) -> Output (JSON Theme Config + Copy)
    - [ ] **Prompt Engineering:** Design system prompt to output valid Tailwind classes and React component structures.
- [ ] **Dynamic Component Loader**
    - [ ] Create a "Shell" page at `/drop/[slug]`
    - [ ] Build a rendering engine that maps the AI JSON Config to actual DOM elements.
    - [ ] **Safety Layer:** Ensure generated styles/components don't break the layout.

## Phase 3: Seller Onboarding & Dashboard (Team C)
- [ ] **Minimal Onboarding Flow**
    - [ ] Build multi-step form: Image Upload -> Description -> Vibe Check.
    - [ ] Integrate File Storage (AWS S3/Uploadthing) for product images.
- [ ] **"Alive" Dashboard UI**
    - [ ] Create the "Status Card" component (changes color/animation based on sales).
    - [ ] Implement Vibe-based feedback loop (e.g., if conversion < 2%, show "Optimize" alert).

## Phase 4: Payments & Commerce (Team B)
- [ ] **Flowglad Integration**
    - [ ] Set up Flowglad SDK.
    - [ ] Implement `createProduct` workflow when Seller publishes a drop.
    - [ ] Create Checkout Link generation.
- [ ] **Webhooks**
    - [ ] Listen for Flowglad `payment.success` events.
    - [ ] Update inventory and "Sold Out" state in real-time.

## Phase 5: Integration & Polish (All)
- [ ] **End-to-End Testing**
    - [ ] Test User Flow: Create Drop -> Buy Item -> View Dashboard Update.
- [ ] **Vibe Tuning (Team A)**
    - [ ] Improve prompt output for "Luxury", "Cyberpunk", and "Retro" presets.
- [ ] **Demo Prep**
    - [ ] Create 3 distinct "Seed Drops" for the presentation.
