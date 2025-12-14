# Flash-Drop Implementation Plan

This plan is structured for a **3-person team** to execute in parallel during the hackathon.

## Team Structure & Roles

### 1. The Vibe Architect (Member A)
**Focus:** Generative UI, Prompt Engineering, Buyer Experience.
**Goal:** Make the "Buyer" page look incredible and unique for every drop.
**Key Responsibilities:**
*   Designing the system prompt for the AI (Input: Vibe -> Output: React Components/Tailwind).
*   Building the `/drop/[id]` dynamic route that renders the AI output.
*   Integrating the AI SDK (OpenAI/Anthropic) to generate copy and styles.
*   **Vibe Check:** Ensuring the generated designs are responsive and accessible.

### 2. The Infrastructure Lead (Member B)
**Focus:** Backend, Database, Payments (Flowglad).
**Goal:** Ensure the system fosters trust and actually moves money.
**Key Responsibilities:**
*   Setting up Next.js 14, PostgreSQL (Prisma/Drizzle), and TRPC/Server Actions.
*   **Flowglad Integration:** Implementing product creation and checkout flows.
*   Handling Webhooks: Real-time inventory deduction and order tracking.
*   Security: Auth (Clerk/NextAuth) and API protection.

### 3. The Product Engineer (Member C)
**Focus:** Seller Onboarding, "Alive" Dashboard.
**Goal:** Create a "Studio" feel for the seller and a "Reactive" admin panel.
**Key Responsibilities:**
*   Building the Minimal Onboarding Flow (Image Upload -> Vibe Input).
*   Developing the "Alive Dashboard" that changes UI based on metrics (Sales vs. Traffic).
*   Implementing the specific logic for "Hype", "Quiet", and "Ghost" states in the dashboard.
*   Admin UI components (Charts, Tables).

---

## Detailed Layer Implementation

### Layer 1: Foundation (Hours 0-4)
*   **ALL:**
    *   Initialize Repo: Next.js + Tailwind + Shadcn/UI.
    *   Agree on Database Schema (User, Drop, Order).
*   **Member B:** Set up DB (Neon/Supabase) and Auth.
*   **Member A:** Experiment with prompts in Playground. "Given 'Spicy Chili', generate a JSON theme."
*   **Member C:** Build static wireframes for Onboarding and Dashboard.

### Layer 2: The Core Loops (Hours 4-12)
*   **Member A (Buyer Side):**
    *   Build the `DropRenderer` component.
    *   Test: Can it render a "Dark Mode Cyberpunk" page vs "Cottagecore" page dynamically?
*   **Member B (Payments):**
    *   Connect Flowglad SDK.
    *   Create a test product and successfully complete a transaction in sandbox.
*   **Member C (Seller Side):**
    *   Wire up the Onboarding Form to the Database.
    *   Send the user inputs to Member A's AI service.

### Layer 3: The "Magic" (Hours 12-20)
*   **Member A:**
    *   Refine the creative direction. Add "particle effects", "custom fonts", and "layout shifts" to the Vibe Engine.
*   **Member B:**
    *   Webhooks! Make sure the "Sold Out" state works instantly.
    *   Optimize API latency.
*   **Member C:**
    *   Implement the "Alive" logic. If sales > 10, make the dashboard turn Gold.
    *   Add the "AI Suggestions" into the dashboard.

### Layer 4: Integration & Polish (Hours 20-24)
*   **ALL:**
    *   **The Demo Flow:** Practice the exact sequence: *Upload Image -> Type 'Matrix' -> Click Link -> Buy with Apple Pay -> Watch Dashboard Explode.*
    *   Fix critical bugs.
    *   Record the demo video.
