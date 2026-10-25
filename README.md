# Campus LOL Admin Archive

An independent administrator website for the Campus LOL meme database. It shares the existing Supabase backend while keeping administrative access behind Google OAuth and a database-backed `is_superadmin` check.

## Features

- Overview statistics from profiles, memes, and votes
- Read-only profile directory
- Create, read, update, and delete meme records
- Read-only vote log
- Google authentication and superadmin route protection

## Local setup

1. Copy the existing project's `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` into `.env.local`.
2. Run `supabase/admin-setup.sql` in the shared Supabase project's SQL Editor. Replace the placeholder email with your Google account email first.
3. Add `http://localhost:3000/auth/callback` to Supabase Auth redirect URLs.
4. Run `npm ci`, then `npm run dev`.

For Vercel, add the same two public Supabase variables and add the deployed `/auth/callback` URL to Supabase Auth redirect URLs.
