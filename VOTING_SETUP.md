# Farewell Design - Voting System Setup Guide

## Overview

The Farewell Design voting system has been implemented with the following features:

- **8 Product Designs**: Displays 8 different design products for voting
- **Real-time Vote Tracking**: Uses Supabase real-time subscriptions to sync votes across all devices
- **Vote Chart**: Visual bar chart showing vote distribution across all products
- **Duplicate Vote Prevention**: Uses browser fingerprinting to prevent duplicate votes from the same device
- **Responsive Design**: Grid layout that adapts to mobile, tablet, and desktop screens
- **Rounded Image Cards**: Product images displayed with rounded corners matching the link button design

## Database Setup

The voting system uses two Supabase tables:

### 1. `farewell_products` Table

Contains the product design information:
- `id`: UUID primary key
- `title`: Product name (e.g., "Minimalist Kit", "Neon Dream")
- `image_url`: URL to the product image
- `order`: Display order (1-8)
- `created_at`: Creation timestamp

### 2. `product_votes` Table

Tracks votes for each product:
- `id`: UUID primary key
- `product_id`: Foreign key reference to farewell_products
- `voter_ip_hash`: Hashed identifier for the voter (browser fingerprint)
- `created_at`: Vote timestamp
- Unique constraint on (product_id, voter_ip_hash) to prevent duplicate votes

## Creating the Database Tables

Execute the SQL migration file in your Supabase dashboard:

```bash
# Go to Supabase Dashboard > SQL Editor
# Copy and paste the contents from: scripts/001_create_voting_tables.sql
# Click "Run" to execute
```

Or use the database initialization that happens automatically on first page load via `VotingDbInit` component.

## Files Created

### Components
- `/components/voting-chart.tsx` - Bar chart showing vote distribution
- `/components/product-card.tsx` - Individual product card with voting button
- `/components/voting-db-init.tsx` - Auto-initializes database tables and sample products

### Pages & Routes
- `/app/voting/page.tsx` - Main voting page with grid of products and chart

### Utilities & Libraries
- `/lib/supabase/client.ts` - Browser Supabase client setup
- `/lib/supabase/server.ts` - Server-side Supabase client setup
- `/lib/vote-utils.ts` - Browser fingerprinting utility for vote tracking

### Main Page Integration
- `/app/page.tsx` - Added "Farewell Design" link button in the main links array

## Features Implemented

### 1. **Voting Page** (`/voting`)
- Displays 8 products in a responsive 4-column grid (mobile: 1 col, tablet: 2 col, desktop: 4 col)
- Shows a bar chart with vote distribution at the top
- Each product card shows:
  - Product image with rounded corners
  - Product title
  - Vote button with current vote count
  - "Already voted" indicator after voting

### 2. **Real-time Voting**
- Votes are instantly synced across all open browser windows/devices
- Uses Supabase real-time subscriptions for updates
- Prevents duplicate votes using browser fingerprint hashing

### 3. **Vote Chart**
- Displays bar chart of all products and their vote counts
- Updates in real-time as new votes come in
- Uses Recharts library for visualization
- Responsive design that adapts to screen size

### 4. **Client-side Vote Prevention**
- Uses SHA-256 hashing of browser fingerprint to create unique voter ID
- Stores hashed IP + user agent + language + screen resolution
- Prevents the same user from voting multiple times

## Environment Variables Required

The following environment variables are automatically set when Supabase is connected:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## How to Use

1. **Access the Voting Page**: Click "Farewell Design" button on the home page
2. **Vote**: Click the "Vote" button on any product card
3. **See Results**: The vote count updates instantly on the button and in the chart
4. **View Chart**: Check the bar chart at the top to see overall voting distribution

## Sample Products

The system comes pre-populated with 8 sample products:

1. Minimalist Kit
2. Neon Dream
3. Vintage Vibes
4. Modern Edge
5. Nature Inspired
6. Bold Statement
7. Sleek Future
8. Elegant Classic

You can modify these in the `VotingDbInit` component or directly in the Supabase database.

## Styling

The voting system uses the existing theme system from the main app:

- **Colors**: Uses CSS variables from `globals.css` for theme consistency
- **Spacing**: Uses Tailwind spacing scale (gap, padding, margin)
- **Rounded Corners**: Matches LinkButton styling with `rounded-lg` class
- **Responsive**: Mobile-first approach with Tailwind breakpoints

## Troubleshooting

### Database Tables Not Created

1. Check Supabase connection in the "Vars" section of the sidebar
2. Verify environment variables are set correctly
3. Run the SQL migration manually in Supabase dashboard

### Votes Not Syncing

1. Ensure Supabase real-time is enabled
2. Check browser console for any errors
3. Verify Row Level Security policies are set to allow public read/write

### Vote Button Disabled After Voting

This is expected behavior - the browser fingerprint prevents duplicate votes. To reset:
1. Clear browser cache
2. Use a different device
3. Use a private/incognito window

## Future Enhancements

Possible improvements:
- Add IP-based voting tracking for more security
- Add product descriptions
- Add filtering/search for products
- Add vote analytics dashboard
- Add voting time limits or deadlines
