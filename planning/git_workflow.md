# Git Collaboration Strategy: Flash-Drop

**Repository:** [https://github.com/prathamssaraf/Ceres.git](https://github.com/prathamssaraf/Ceres.git)

To ensure the 3-person team moves fast without breaking code ("discrepancies and backlog"), we will use a **Feature Branch Workflow** with a "Squash and Merge" policy.

## 1. The Golden Rules
1.  **Never push directly to `main`.** Always use a branch.
2.  **One Feature = One Branch.** Don't bundle unrelated changes.
3.  **Pull before you Push.** Always sync with `main` before opening a PR.

---

## 2. Branching & Naming Convention
Assign branches based on the Roles defined in `implementation_plan.md`.

| Role | Branch Prefix | Example |
| :--- | :--- | :--- |
| **Vibe Architect (A)** | `feat/vibe-*` | `feat/vibe-engine-prompt`, `feat/vibe-buyer-ui` |
| **Infra Lead (B)** | `feat/infra-*` | `feat/infra-db-setup`, `feat/infra-flowglad` |
| **Product Eng (C)** | `feat/product-*` | `feat/product-onboarding`, `feat/product-dashboard` |

*   **Hotfixes:** If `main` is broken, use `fix/description-of-fix`.

---

## 3. The Workflow Loop (Repeat for every Task)

### Step 1: Sync
Before starting a new task from `task.md`:
```bash
git checkout main
git pull origin main
```

### Step 2: Create Branch
Name it specifically after the task you are doing.
```bash
# Example for Member A
git checkout -b feat/vibe-dynamic-renderer
```

### Step 3: Code & Commit
Commit often locally. Messages should start with the Layer you are working on (L1, L2, L3).
```bash
git add .
git commit -m "L2: Added initial renderer component structure"
```

### Step 4: Sync Again (Crucial)
Before pushing, check if your teammates merged something.
```bash
git pull origin main --rebase
# Resolve conflicts locally if any
```

### Step 5: Push & PR
```bash
git push origin feat/vibe-dynamic-renderer
```
*   Go to GitHub -> Open Pull Request.
*   **Review Rule:** Since it's a hackathon, **Self-Merge is allowed** if tests pass, BUT notifying the group chat ("Merging UI changes, pull main!") is mandatory.

---

## 4. Execution Order (mapped to `implementation_plan.md`)

To avoid merge conflicts, teams should work on separate files initially:

**Layer 1 (Setup):**
1.  **Infra Lead (B)** initializes the repo structure first. Pushes to `main`.
2.  **Everyone else** clones `main` ONLY after Infra Lead gives the green light.

**Layer 2 (Parallel Work):**
*   **Member A:** Works in `/src/app/drop/[slug]` and `/src/lib/ai`.
*   **Member B:** Works in `/src/server` and `/src/lib/flowglad`.
*   **Member C:** Works in `/src/app/admin` and `/src/app/onboarding`.
*   *Note: Since directories are different, conflicts will be near zero.*

**Layer 3 (Integration):**
*   **Merge Checkpoint:** At the end of Layer 2, everyone must stop, merge to main, and verify the build works.
