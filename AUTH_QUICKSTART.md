# Authentication Quick Start Guide

## What's New

✅ Login/Logout buttons in top-right corner  
✅ Google OAuth authentication  
✅ User profile dropdown with logout  
✅ Blur backdrop effect on dropdown  
✅ Real-time voter avatars display  
✅ Automatic user profile creation  
✅ Responsive design for all devices  

## Quick Setup (5 minutes)

### Step 1: Run Database Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "SQL Editor" 
4. Create a new query
5. Copy and paste the contents of `scripts/004_add_user_profiles.sql`
6. Click "Run"

### Step 2: Configure Google OAuth

1. Follow the detailed steps in `GOOGLE_AUTH_SETUP.md`
2. The process takes about 10-15 minutes
3. Key steps:
   - Create Google Cloud Project
   - Enable Google+ API
   - Create OAuth credentials
   - Add redirect URIs
   - Copy Client ID & Secret to Supabase

### Step 3: Test It Out

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/voting`
3. Click "Login" button in top-right
4. Sign in with Google
5. You should see your profile in the header

## File Structure

```
NEW FILES:
- app/login/page.tsx - Login page with Google sign-in
- app/auth/callback/route.ts - OAuth callback handler
- components/auth-header.tsx - Header with login/logout
- components/voters-avatar-group.tsx - Voter avatars display
- scripts/004_add_user_profiles.sql - Database migration

DOCUMENTATION:
- GOOGLE_AUTH_SETUP.md - Detailed Google OAuth setup
- AUTHENTICATION_IMPLEMENTATION.md - Full implementation details
- AUTH_QUICKSTART.md - This file

MODIFIED:
- app/voting/page.tsx - Added AuthHeader and VotersAvatarGroup
```

## How It Works

### User Login Flow
```
1. User clicks "Login" button → /login page
2. User clicks "Sign in with Google" 
3. Redirected to Google login
4. After auth → /auth/callback
5. Callback exchanges code for session
6. Redirected to /voting page
7. User profile automatically created in database
8. User sees their avatar & name in header
```

### User Profile Display
```
Header shows:
- Avatar (from Google or initial in colored circle)
- Username (from Google account)

Click avatar to see dropdown:
- Profile photo
- Full username
- Email address
- Logout button

When dropdown open:
- All background is blurred
- Only dropdown is sharp
- Click outside to close
```

### Voter Display
```
Below vote counter shows:
- Up to 5 voter avatars (overlapped style)
- "+X others" text if more voters
- Total voter count in parentheses
- Updates in real-time as people vote
```

## Key Features

### Security
- ✅ OAuth handled by Supabase (industry standard)
- ✅ User data protected with RLS (Row Level Security)
- ✅ No passwords stored (Google handles auth)
- ✅ Secure session tokens

### Functionality
- ✅ Auto-logout on browser close
- ✅ Remember user across sessions
- ✅ Profile data synced with Google
- ✅ Real-time voter updates

### User Experience
- ✅ One-click Google sign-in
- ✅ No passwords to remember
- ✅ Blur effect on dropdown (visual polish)
- ✅ Responsive design (mobile, tablet, desktop)

## Troubleshooting

### "Login button not showing"
- Check that AuthHeader component is imported in /voting/page.tsx ✓
- Verify voting/page.tsx has `<AuthHeader />` in JSX ✓

### "Google sign-in not working"
- See `GOOGLE_AUTH_SETUP.md` troubleshooting section
- Most common: Client ID/Secret mismatch or wrong redirect URI

### "User avatar not showing"
- Avatar comes from Google's OAuth metadata
- If not available, user's initial is shown in colored circle (fallback)
- This is normal behavior

### "Voter avatars not updating"
- Check that Supabase realtime is enabled for your project
- Verify `voters-avatar-group.tsx` subscription is working
- Check browser console for any errors

## Testing Checklist

- [ ] Database migration ran successfully (no SQL errors)
- [ ] Google OAuth credentials added to Supabase
- [ ] Login button appears in /voting page top-right
- [ ] Can click Login button and see login page
- [ ] Can sign in with Google
- [ ] Redirected to /voting after login
- [ ] Avatar and username appear in header
- [ ] Can click avatar to open dropdown
- [ ] Background blurs when dropdown opens
- [ ] Logout button works and signs out user
- [ ] Can sign in again after logout
- [ ] Voter avatars appear below vote counter
- [ ] Voter count matches total votes

## Need Help?

1. **Google OAuth issues**: See `GOOGLE_AUTH_SETUP.md`
2. **Database issues**: Check if migration ran (no errors in SQL)
3. **Component issues**: Check browser console for React errors
4. **General questions**: See `AUTHENTICATION_IMPLEMENTATION.md`

## Environment Variables

No new environment variables needed!

The app uses existing Supabase configuration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Next Steps (Optional)

After basic setup works:
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Deploy to production (add production domain to Google)
- [ ] Monitor user signups in Supabase dashboard
- [ ] Customize user profiles (add bio, social links, etc.)

## Production Checklist

Before going live:
- [ ] Production domain added to Google OAuth
- [ ] Redirect URIs updated for production
- [ ] Supabase JWT secret configured
- [ ] HTTPS enabled on production domain
- [ ] Test sign-in flow on production

---

**That's it! You now have a fully functional authentication system with Google OAuth.**

Enjoy! 🚀
