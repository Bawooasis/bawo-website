# Waitlist API Setup

The waitlist form submits to `/api/waitlist`. You'll need to set up a backend endpoint to handle submissions.

## Option 1: Supabase (Recommended)

If you're using Supabase, create a table and set up a serverless function:

1. Create a `waitlist` table:
```sql
CREATE TABLE waitlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. Create a Supabase Edge Function or use the REST API directly from your frontend.

## Option 2: Vercel Serverless Function

Create `api/waitlist.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, city } = req.body;

  // Validate input
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Store in your database (Supabase, MongoDB, etc.)
  // Example with Supabase:
  // const { data, error } = await supabase
  //   .from('waitlist')
  //   .insert([{ name, email, city }]);

  // For now, just log it
  console.log('Waitlist signup:', { name, email, city });

  return res.status(200).json({ success: true });
}
```

## Option 3: Custom Backend

Point the form to your backend URL by updating the fetch URL in `WaitlistForm.tsx`:

```typescript
const response = await fetch("https://your-backend.com/api/waitlist", {
  // ...
});
```

## Testing Locally

For local development, you can use a proxy in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

