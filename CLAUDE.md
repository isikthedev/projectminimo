# PROJECTMINIMO - System Instructions & Architecture

This document serves as the guide and strict system prompt for all Claude-based AI coding agents working on this repository.

## 🚀 Commands
- **Start Development Server:** `npm run dev`
- **Build Production App:** `npm run build`
- **Install Dependencies:** `npm install`
- **TypeScript Check:** `npx tsc --noEmit`

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (App Router + Turbopack)
- **CMS Engine:** Payload CMS 3.0 (Native Integration)
- **Database:** PostgreSQL (via Supabase) with logical multi-tenancy
- **UI:** Shadcn UI + Tailwind CSS v3

## 🏗️ Core Architecture Guidelines (Must Follow)
1. **Single DB Multi-tenancy:**
   - Every collection representing tenant data (e.g., `Pages`, `Media`) must have a `tenant` relationship field linking to the `tenants` collection (`hasMany: false`).
   - Tenant isolation must be strictly enforced at the database query level using the custom access helper `isTenantOrSuperAdmin` (defined in `src/core/access.ts` or similar).
   - Non-super-admins (e.g., `tenant-admin` or `user`) must ONLY have access to documents belonging to their assigned tenant.

2. **Auto-Tenant Assignment:**
   - Always use a `beforeChange` hook in tenant-scoped collections to automatically assign the logged-in user's `tenant` ID to the document.
   - Non-super-admins should not manually select or even see the `tenant` field in the admin UI (make it conditional on user role or read-only).

3. **Next.js 16 Subdomain Routing (`src/proxy.ts`):**
   - We use Next.js 16 native `src/proxy.ts` routing instead of the deprecated `middleware.ts` convention.
   - **Do not** create `middleware.ts`. All subdomains (e.g., `[subdomain].localhost:3000`) and the super admin (`admin.localhost:3000`) must be intercepted and internally rewritten within `src/proxy.ts`.

## 🛑 Strict Token & Request Conservation Rules
To prevent hitting API rate limits (e.g., 10-15 requests/minute) and save context window tokens:
1. **No Loops:** NEVER enter recursive terminal loops or automated wait-check loops.
2. **No Automated Testing:** DO NOT install, run, or set up browser binaries (e.g., Playwright/Chromium) or execute end-to-end (E2E) tests unless explicitly commanded by the user.
3. **Be Concise:** Provide straight-to-the-point code implementations. Do not output lengthy, wordy explanations or redundant comments.
4. **One-Shot File Edits:** Read the file, make the necessary modifications, save, and exit. Do not perform multiple trial-and-error iterations.
5. **Typescript Strictness:** Await dynamic page route parameter promises (`await params`) as required by Next.js 16 to avoid runtime/compiler errors.

## 📝 Code Conventions
- Use standard TypeScript for type safety.
- Write functional React components using Tailwind CSS v3 for styling.
- Keep components clean, lightweight, and modular.