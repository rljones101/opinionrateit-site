# Deployment Guide

How the OpinionRateIt site is deployed to AWS via the **Amplify CLI**.

> The older deployment notes in `docs/` (AMPLIFY_DEPLOYMENT_FIX.md,
> DEPLOYMENT_ISSUE_SUMMARY.md, RESOLUTION_SUMMARY.md, etc.) describe one-off
> incident fixes and reference stale app IDs / environment names. **This file is
> the source of truth** for the current, verified configuration.

## Current environment (verified)

The active Amplify environment is **`dev`** (from `amplify/.config/local-env-info.json`
and `amplify/team-provider-info.json`):

| Setting | Value |
| --- | --- |
| Environment name | `dev` |
| Amplify App ID | `dyrvis20ihsc` |
| CloudFormation stack | `amplify-opinionrateitbackend-dev-0dc57` |
| AWS account | `399951027632` |
| Region | **us-east-2** (Ohio) |
| Lambda function | `reviewersFn` (the Express API) |
| API category | `orateitApi` (API Gateway) |
| Live site | https://dev.opinionrateit.com/ |

> ⚠️ The region is **us-east-2**, not us-east-1. Always select us-east-2 in the
> AWS Console, or CLI/console lookups will appear to show "missing" resources.
>
> There is also a stub `devbackend` entry in `team-provider-info.json`; it is
> empty/unused. `dev` is the real environment.

## What gets deployed

Two pieces:

1. **Backend** — the Express app in `amplify/backend/function/reviewersFn/src`
   runs as a Lambda behind API Gateway, provisioned by CloudFormation.
2. **Frontend** — the Vue app (built with Vite) hosted by Amplify.

## Prerequisites

- Amplify CLI installed (verified working: `amplify --version` → 14.2.5).
- AWS credentials configured for account `399951027632` with permissions for
  CloudFormation, Lambda, IAM, API Gateway, DynamoDB, and S3.
- Local Amplify state in sync with the cloud. If it isn't, re-pull:
  ```bash
  amplify pull --appId dyrvis20ihsc --envName dev
  ```

## Deploy commands

Run from the project root.

```bash
# Check which environment is active and the status of each resource
amplify status

# Deploy ONLY the backend (Lambda + API changes)
amplify push

# Build the frontend AND deploy everything (backend + frontend hosting)
amplify publish
```

`amplify publish` runs the Vite production build (`npm run build`) and uploads
the `dist/` output to Amplify Hosting, then pushes any backend changes.

> If the frontend is also wired to **git-based CI in the Amplify Console**, a
> push to the connected branch triggers an automatic build/deploy. The build
> spec for that lives in the Amplify Console (there is no `amplify.yml` in this
> repo). Confirm in the Console which branch is connected before relying on it.

## Pre-deploy checklist (READ BEFORE DEPLOYING)

Deploying affects the live site and is hard to reverse. Confirm all of these
first:

1. **Backend database mode.** The backend is mid-migration from MongoDB to
   DynamoDB. Reviewer/video/review paths use DynamoDB, but **auth/sessions and
   some entities still require MongoDB**, and the app connects to Mongo on boot.
   The deployed Lambda must have the correct environment so nothing breaks:
   - `USE_DYNAMODB=true`
   - `USE_MONGODB` set appropriately (and a reachable MongoDB) until the auth /
     remaining-entity migration is complete — otherwise login and other
     Mongo-backed endpoints will fail in production.
   - DynamoDB config: `DYNAMODB_REGION=us-east-2`, `DYNAMODB_TABLE_PREFIX`, and
     **no** `DYNAMODB_ENDPOINT` (that is local-only).
2. **DynamoDB tables exist in AWS** for the deployed prefix (the AWS equivalent
   of `dynamo:setup`). Production uses real DynamoDB, not the local `-inMemory`
   container. See `docs/DYNAMODB_SUCCESS.md` for the table list.
3. **Secrets are NOT shipped in source.** The `.env.*` files currently contain
   live-looking AWS/Stripe/YouTube keys. These must be rotated and provided as
   Lambda/Amplify environment variables, not committed values.
4. **The code you intend to ship is on the deploy branch.** Feature work lives on
   branches (e.g. `feature/*`); merge via PR before deploying so you don't ship
   stale or partial code.
5. **Frontend `VITE_API_URL`** points at the deployed API Gateway URL in the
   production build env (not `http://localhost:3000`).

## Verifying a deploy

```bash
# CloudFormation stack should end in UPDATE_COMPLETE / CREATE_COMPLETE
# (AWS Console → CloudFormation → us-east-2)

# Lambda exists
aws lambda get-function --function-name reviewersFn-dev --region us-east-2

# Hit a public endpoint through API Gateway (get the base URL from `amplify status`
# or the Amplify Console), e.g.
curl https://<api-id>.execute-api.us-east-2.amazonaws.com/dev/api/v1/publishedVideos
```

Then load https://dev.opinionrateit.com/ and confirm the public video browser
loads and (once auth is migrated/configured) login works.

## If a deploy gets stuck

The stack has previously broken on IAM-role / CloudFormation mismatches (see
`docs/AMPLIFY_DEPLOYMENT_FIX.md`). If `amplify push` fails:

1. Check the CloudFormation stack events in the AWS Console (us-east-2) for the
   specific resource error.
2. Do **not** manually delete Amplify-created IAM roles or the wrong stack —
   that is what caused the previous incident.
3. Re-sync local state with `amplify pull --appId dyrvis20ihsc --envName dev`.
