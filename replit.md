# my-v0-project

## Overview
A personal portfolio and design voting platform by Nelsen Chandra. Serves as a link-in-bio page and hosts a "Farewell Design" voting system with real-time updates and authentication.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Package Manager**: pnpm

## Project Structure
- `app/` - Next.js App Router pages (layout, main page, login, voting)
- `components/` - Reusable React components (UI primitives, voting, auth)
- `lib/` - Utilities and Supabase client configuration
- `public/` - Static assets
- `scripts/` - SQL migration scripts for Supabase setup
- `styles/` - Additional global CSS

## Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development
- Run: `pnpm dev --port 5000 --hostname 0.0.0.0`
- App available at port 5000

## Deployment
- Target: autoscale
- Build: `pnpm run build`
- Start: `pnpm run start`
