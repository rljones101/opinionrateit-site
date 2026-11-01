# User Preferences — Roadmap

Status: **Deferred.** The Preferences tab was removed from the profile UI on
2026-10-31 because every option in it was a closed loop — saved to DynamoDB and
read back into the form, but nothing elsewhere in the app consumed any value.
Rather than ship controls that silently do nothing, we pulled the tab and
captured the intended work here as future roadmap items.

This document is the single source of truth for what each preference was meant
to do, what it would take to make it real, and the current state of the code
that already exists for it.

## What was removed from the UI

- The **Preferences** tab was removed from both profile views:
  - `src/views/ProfileView.vue` (route `profile`, `/profile`)
  - `src/views/myProfile/MyProfile.vue` (legacy route `my-profile`, `/u/:name/profile`)
- The tab now shows: **Settings, Activity, Security** (Settings is the default).

## Code that still exists (intentionally left in place)

These are NOT wired into any visible UI anymore, but are kept as the foundation
for the roadmap work below. The backend is harmless (it only responds when
called) and the frontend pieces are the starting point for a future rebuild.

| Piece | Path | Notes |
| --- | --- | --- |
| Preferences form component | `src/components/profile/ProfilePreferences.vue` | No longer imported by any view. Full form with all groups below. |
| Preferences Pinia store | `src/stores/preferencesStore.ts` | `fetchPreferences` / `updatePreferences`, typed `UserPreferences` shape. |
| Backend controller | `amplify/backend/function/reviewersFn/src/controllers/preferencesController.js` | `GET`/`PATCH /api/v1/users/me/preferences`. |
| Backend service | `amplify/backend/function/reviewersFn/src/services/dynamodb/PreferencesService.js` | One DynamoDB item per user (`PK=USER#<id>`, `SK=PREFERENCES`). Schemaless shallow-merge per section. |
| Routes | `amplify/backend/function/reviewersFn/src/routes/userRoutes.js` | `/me/preferences` GET + PATCH still registered. |

The backend store is schemaless (it shallow-merges whatever sections it
receives and strips only `PK`/`SK`). That means we can reintroduce fields
incrementally without a data migration.

## Backend default preferences shape (for reference)

```jsonc
{
  "notifications": { "email": true, "push": false, "reviews": true, "videoUpdates": true, "weeklyDigest": false },
  "display":       { "theme": "auto", "language": "en", "timezone": "UTC", "dateFormat": "MM/DD/YYYY" },
  "privacy":       { "profileVisibility": "public", "showEmail": false, "showActivity": true, "allowMessages": true },
  "content":       { "autoplayVideos": true, "showMatureContent": false, "defaultVideoQuality": "auto", "subtitlesEnabled": false },
  "security":      { "loginNotifications": true, "suspiciousActivityAlerts": true, "passwordExpiry": false, "sessionTimeout": 30 }
}
```

---

## Roadmap items

Each item lists: what the preference promises, why it's deferred, the
dependency/prerequisite that must exist first, and a rough effort sense.

### 1. Playback preferences (likely first candidate to revive)

Fields: `content.autoplayVideos`, `content.subtitlesEnabled`,
`content.defaultVideoQuality`.

- **Promise:** control how the video player behaves by default.
- **Why deferred:** `src/composables/useYouTube.ts` hardcodes `playerVars`
  (`playsinline`, `modestbranding`, `controls`) and never reads preferences.
- **To make real:** read the preferences store in `useYouTube.ts` and map:
  - `autoplayVideos` -> `playerVars.autoplay`
  - `subtitlesEnabled` -> `playerVars.cc_load_policy` (and `cc_lang_pref`)
  - `defaultVideoQuality` -> call `player.setPlaybackQuality(...)` on ready
    (note: YouTube treats quality as a suggestion, not a guarantee).
- **Effort:** Small. No backend change needed; the fields already persist.
- **Recommendation:** This is the one group genuinely worth reviving on its own
  because it is cheap and visibly useful.

### 2. Theme switching

Field: `display.theme` (`light` | `dark` | `auto`).

- **Promise:** switch between light, dark, and system themes.
- **Why deferred:** the app is hardcoded dark. `src/main.ts` unconditionally
  adds the `app-dark` class to `<html>` and scopes PrimeVue dark mode to it.
  There is no light theme defined.
- **To make real (prerequisite):** author a light token palette in
  `src/assets/tailwind.css` (`@theme`), then add a theme controller that reads
  `display.theme`, toggles the `app-dark` class, and honors `auto` via a
  `prefers-color-scheme` media query listener.
- **Effort:** Medium-Large (designing/validating a full light theme is the bulk).
- **Note:** default mismatch to fix when revived — backend default is `auto`,
  the old form defaulted/reset to `light`.

### 3. Internationalization (language)

Field: `display.language`.

- **Promise:** switch UI language.
- **Why deferred:** no i18n library is installed and no strings are
  externalized/translated.
- **To make real (prerequisite):** add `vue-i18n`, extract all UI copy into
  message catalogs, provide translations, and wire the locale to
  `display.language`.
- **Effort:** Large (ongoing — every new string needs translation).

### 4. Timezone & date format

Fields: `display.timezone`, `display.dateFormat`.

- **Promise:** render dates/times in the user's timezone and preferred format.
- **Why deferred:** `src/utils/DateUtils.ts` hardcodes the `en-US` locale and
  never passes a `timeZone` to `Intl`.
- **To make real:** make `DateUtils` preference-aware (pass `timeZone` and a
  format derived from `dateFormat`); have callers use the user's setting.
- **Effort:** Medium (touches every date render path).

### 5. Notifications

Fields: `notifications.{email, push, reviews, videoUpdates, weeklyDigest}`.

- **Promise:** control which notifications the user receives and how.
- **Why deferred:** there is no notification system. A `nodemailer` helper
  exists at `amplify/backend/function/reviewersFn/src/utils/email.js` but is
  never imported/called. No web-push, service worker, event publishers, or
  digest scheduler.
- **To make real (prerequisites):**
  - Email: wire a real transport (e.g. SES) + templates + trigger points.
  - Push: web-push subscription flow + service worker + VAPID keys.
  - Events: publishers for review replies / followed-channel uploads.
  - Weekly digest: a scheduled job (e.g. EventBridge) that aggregates + sends.
- **Effort:** Large (this is its own project per channel).

### 6. Privacy

Fields: `privacy.{profileVisibility, showEmail, showActivity, allowMessages}`.

- **Promise:** control who can see your profile/email/activity and message you.
- **Why deferred:** there is no public/other-user profile view to enforce
  visibility against, and no messaging feature at all. These gate nothing today.
- **To make real (prerequisites):**
  - A public profile view that reads another user's data.
  - Server-side enforcement of `profileVisibility` on that view's data fetch.
  - `showEmail` / `showActivity` gating on the public view.
  - A messaging feature before `allowMessages` means anything.
- **Effort:** Large (depends on building public profiles + messaging first).

### 7. Security tab

The **Security** tab (`src/components/profile/ProfileSecurity.vue`) is a
separate feature from the Preferences store. Current state as of 2026-10-31:

- **Change Password — LIVE.** Real `PATCH /users/updateMyPassword`.
- **Active Sessions — LIVE (wired 2026-10-31).** Lists and revokes real
  sessions against the existing backend:
  - `GET /api/v1/users/me/sessions` (list, flags current)
  - `DELETE /api/v1/users/me/sessions/:id` (revoke one; refuses current)
  - `DELETE /api/v1/users/me/sessions` (revoke all others)
  Backed by `SessionService` (dedicated `user-sessions` DynamoDB table, token
  hashing, 30-day TTL). Sessions are created on every login and validated in
  `protect`.
- **Two-Factor Authentication — REMOVED (deferred).** Was a `setTimeout` stub
  flipping a local boolean; no backend. See roadmap item 7a.
- **Security Notifications + Session Timeout — REMOVED (deferred).** Was a
  `setTimeout` stub that persisted nothing. See roadmap item 7b.

#### 7a. Two-Factor Authentication (deferred)

- **Promise:** optional TOTP-based 2FA on the account.
- **Why deferred:** no backend at all (no secret storage, no enrollment, no
  login-time verification).
- **To make real (prerequisites):**
  - TOTP secret generation + encrypted storage per user.
  - Enrollment flow (QR code / otpauth URI) and verification step.
  - Enforcement at login (prompt for code when 2FA is enabled).
  - Recovery/backup codes.
- **Effort:** Large.

#### 7b. Security notifications & configurable session timeout (deferred)

Fields that used to appear: `loginNotifications`, `suspiciousActivityAlerts`,
`passwordExpiry`, `sessionTimeout`.

- **Why deferred:**
  - Login / suspicious-activity notifications depend on a notification system
    (see item 5) that does not exist.
  - `passwordExpiry` needs an expiry policy + prompt flow.
  - `sessionTimeout` is currently hardcoded to 30 days in `SessionService`
    (`createSession`); making it configurable means reading a per-user setting
    when issuing the session TTL.
- **Effort:** Medium-Large (notifications piece is the heavy part).

---

## Suggested sequencing (when revived)

1. **Playback (item 1)** — cheap, self-contained, visible value. Good first revive.
2. **Configurable session timeout (item 7b, partial)** — leverages the existing
   `SessionService`; small change to make the 30-day TTL per-user.
3. **Theme (item 2)** — once a light palette is worth the design effort.
4. **2FA (item 7a)** — meaningful account security, but self-contained backend work.
5. **Privacy (item 6)** — only after public profiles exist.
6. **Notifications (item 5, incl. security notifications 7b)** and **i18n (item 3)**
   — largest, lowest near-term ROI.

> Note: Active Sessions (item 7) is already live as of 2026-10-31 — the
> backend existed and the UI was wired to it, so it is no longer a roadmap item.
