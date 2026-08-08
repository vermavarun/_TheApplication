# Social Logins (GitHub & Google OAuth)

Authentication is implemented with [NextAuth v5](https://authjs.dev) (Auth.js). The header shows a **Login** button with a GitHub / Google dropdown. On first sign-in the user is registered in the .NET API. On subsequent sign-ins the existing record is returned silently.

---

## Architecture

```
Browser
  └─ Header component (next-auth/react — useSession, signIn, signOut)
       └─ /api/auth/[...nextauth]  (Next.js route handler)
            └─ NextAuth config (app/lib/auth.ts)
                 ├─ GitHub provider
                 ├─ Google provider
                 └─ signIn callback → POST /users/register  (dotnet API)
```

---

## Files changed

| File | Purpose |
|------|---------|
| `app/lib/auth.ts` | NextAuth config — providers + signIn callback |
| `app/api/auth/[...nextauth]/route.ts` | Next.js route handler for all auth endpoints |
| `app/providers.tsx` | Client `SessionProvider` wrapper |
| `app/components/header.tsx` | Header with login dropdown and user avatar |
| `app/layout.tsx` | Uses `<Header>` and `<Providers>` |
| `env.sample` | Template for required environment variables |
| `../dotnet-apis-dashboard/Models/AppUser.cs` | `AppUser` entity (Email, Name, Provider, ProviderAccountId, CreatedAt) |
| `../dotnet-apis-dashboard/Data/ApplicationDbContext.cs` | Added `DbSet<AppUser> Users` |
| `../dotnet-apis-dashboard/Program.cs` | Added `POST /users/register` endpoint |

---

## 1. Generate AUTH_SECRET

```bash
npx auth secret
```

Copy the printed value — it becomes `AUTH_SECRET` in `.env.local`.

---

## 2. Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name**: anything (e.g. `TheApplication Dev`)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Click **Register application**
4. Copy **Client ID** → `AUTH_GITHUB_ID`
5. Click **Generate a new client secret** → `AUTH_GITHUB_SECRET`

---

## 3. Create a Google OAuth App

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Under **Authorized redirect URIs** add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Click **Create**
6. Copy **Client ID** → `AUTH_GOOGLE_ID`
7. Copy **Client Secret** → `AUTH_GOOGLE_SECRET`

> **Note:** The Google OAuth consent screen must be configured first. For development, add your own Google account as a test user.

---

## 4. Configure .env.local

Copy `env.sample` to `.env.local` and fill in the values:

```env
API_BASE_URL=http://localhost:8080

AUTH_SECRET=<generated above>

AUTH_GITHUB_ID=<your GitHub client ID>
AUTH_GITHUB_SECRET=<your GitHub client secret>

AUTH_GOOGLE_ID=<your Google client ID>
AUTH_GOOGLE_SECRET=<your Google client secret>
```

`.env.local` is git-ignored — never commit secrets.

---

## 5. Run the app

```bash
# Terminal 1 — .NET API
cd dotnet-apis-dashboard
dotnet run

# Terminal 2 — Next.js
cd nextjs-dashboard
npm run dev
```

Open `http://localhost:3000`. Click **Login** in the header to sign in with GitHub or Google.

---

## User registration flow

On every sign-in the `signIn` callback in `app/lib/auth.ts` calls:

```
POST http://localhost:8080/users/register
{
  "email": "...",
  "name": "...",
  "provider": "github" | "google",
  "providerAccountId": "..."
}
```

The .NET API looks up the user by `(provider, providerAccountId)`:
- **New user** → inserts into `AppUser` table and returns `201 Created`
- **Existing user** → returns `200 OK` with `{ registered: false }`

If the .NET API is unavailable the sign-in still succeeds (the callback catches the error and returns `true`).

---

## Production callback URLs

Update the OAuth app settings in GitHub / Google to add your production URL:

```
https://<your-domain>/api/auth/callback/github
https://<your-domain>/api/auth/callback/google
```

Also set `AUTH_URL=https://<your-domain>` in production environment variables.
