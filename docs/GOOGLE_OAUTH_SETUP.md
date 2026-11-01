# Google OAuth — "Sign in with Google" Setup

This app supports signing in / signing up with Google. It uses Google Identity
Services (GIS) on the frontend to obtain a Google **ID token**, which the
backend verifies with Google's official `google-auth-library`. On success the
backend find-or-creates the user and issues the normal session cookies.

- New Google users get a **Free** account (`role: 'free'`, `active: true`),
  with no password.
- If the Google email matches an existing account, that account is **linked**
  (the Google id is recorded) and the user is logged in.

## 1. Create the OAuth Client ID (Google Cloud Console)

This is free and takes a few minutes.

1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Create or select a project (you can reuse the project that hosts the
   existing YouTube Data API key).
3. **APIs & Services → OAuth consent screen**
   - User type: **External**.
   - Fill in app name, support email, developer contact email.
   - Default scopes are sufficient (basic profile + email come with GIS).
   - While in **Testing** mode, add your Google account under **Test users**
     so you can sign in before publishing.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (Vite dev server)
     - your production origin later, e.g. `https://dev.opinionrateit.com`
   - **Authorized redirect URIs**: not required for the GIS token flow (leave
     blank).
   - Create, then copy the **Client ID**
     (`...apps.googleusercontent.com`). The client **secret is not needed**
     for this flow.

## 2. Configure the app

Set the SAME client id in both places (the backend verifies the token's
audience against its copy, so they must match):

- Frontend — `/.env.development`:
  ```
  VITE_GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
  ```
- Backend — `amplify/backend/function/reviewersFn/src/.env.development`:
  ```
  GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
  ```

Both `.env.development` files are gitignored. The tracked
`/.env.development.example` documents the frontend var.

If either value is empty the feature degrades gracefully: the "Continue with
Google" button is hidden on the frontend, and the backend route returns 503.

## 3. Run it

Restart both services after changing env vars (Vite only reads env at startup):

- Backend: `npm run dev` in `amplify/backend/function/reviewersFn/src`
- Frontend: `npm run dev` at the repo root

Open the login dialog → "Continue with Google" should appear and work.

## 4. Production / deployment notes

- Add the production origin to the OAuth client's **Authorized JavaScript
  origins**.
- Set `GOOGLE_CLIENT_ID` in the Lambda function's environment and
  `VITE_GOOGLE_CLIENT_ID` in the production build environment.
- Publish the OAuth consent screen (move out of Testing) once ready for real
  users, otherwise only listed test users can sign in.

## How it works (code map)

Backend (`amplify/backend/function/reviewersFn/src`):
- Route: `POST /api/v1/users/auth/google` — public, registered before the
  `protect` middleware, and intentionally bypasses `validateLogin`/
  `validateSignup` (no password involved). See `routes/userRoutes.js`.
- Controller: `authController.dynamo.js` → `googleAuth`. Verifies the ID token
  via `OAuth2Client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID })`,
  requires a verified email, then find-or-creates/links and calls
  `createSendToken` (same cookie + session contract as normal login).
- User model: `services/dynamodb/UserService.js` → `createOAuthUser`
  (password-less, stores `authProvider: 'google'` + `googleId`, Free, active)
  and `linkGoogleAccount`.
- CSP (helmet in `app.js`) allows `accounts.google.com`.

Frontend (`src`):
- Plugin: `vue3-google-login`, registered in `main.ts` with
  `VITE_GOOGLE_CLIENT_ID`.
- Button: `components/forms/UserLogin.vue` renders `<GoogleLogin>` when
  `VITE_GOOGLE_CLIENT_ID` is set; its callback calls
  `userStore.loginWithGoogle(credential)` → `POST /users/auth/google` →
  redirect to the videos route.
- CSP in `vite.config.ts` allows `accounts.google.com`.

## Verifying

The backend route was verified for:
- Unconfigured (`GOOGLE_CLIENT_ID` empty) → `503` with a clear message.
- Missing `credential` in the body → `400`.
- Invalid/forged token (with a client id set) → `401` ("Invalid Google
  credential") — `google-auth-library` rejects it.

The full happy path (valid token → find-or-create → session) requires a real
Google round-trip in the browser with a configured client id.
