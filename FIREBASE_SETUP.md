# Firebase Authentication Setup Guide

This guide will help you set up Google Authentication for AthletEcho.

## Prerequisites

- A Google account
- Firebase account (free tier is sufficient)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name: `AthletEcho` (or your preferred name)
   - Enable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Google Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Enter your project support email
5. Click **Save**

## Step 3: Register Your Web App

1. In Firebase Console, click the **Web** icon (`</>`) or go to **Project Settings** > **General**
2. Register your app:
   - App nickname: `AthletEcho Web`
   - Firebase Hosting: Not set up (optional)
3. Click **Register app**
4. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase config values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your domains:
   - `localhost` (already included for development)
   - Your production domain (e.g., `atheltecho.com`)

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/signin`
3. Click "Sign in with Google"
4. You should be redirected to Google's sign-in page
5. After signing in, you'll be redirected back to `/home`

## Troubleshooting

### Error: "Firebase: Error (auth/unauthorized-domain)"
- Make sure `localhost` is in your authorized domains in Firebase Console

### Error: "Firebase: Error (auth/api-key-not-valid)"
- Check that your `.env.local` file has the correct API key
- Restart your dev server after changing environment variables

### Error: "Firebase: Error (auth/popup-closed-by-user)"
- User closed the popup window - this is normal behavior

## Using Protected Routes

To protect a page/route, wrap it with `ProtectedRoute`:

```jsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

## Using Auth Context

Access user data and auth functions in any component:

```jsx
"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, signInWithGoogle, logout } = useAuth();
  
  if (!user) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user.displayName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## User Object Structure

The `user` object contains:
- `uid`: Unique user ID
- `email`: User's email address
- `displayName`: User's display name
- `photoURL`: User's profile picture URL

## Next Steps

- Set up Firestore database to store user profiles
- Add more authentication providers (Email/Password, etc.)
- Implement role-based access control (player/coach)
