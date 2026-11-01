# opinionrateit-site
Created in May 2023 - by Rick Jones


## Description
This is a project that shows off some of my development skills using frontend technologies such as
`Vue 3, Pinia, Tailwind CSS`. The backend is an Express app (deployed via the Amplify CLI as a Lambda)
that stores its data in **DynamoDB**.

> **Note:** The backend is migrating off MongoDB to DynamoDB. The reviewer and published-video data
> paths now run on DynamoDB; some remaining features (auth/sessions and a few content entities) are
> still being ported. Local development targets DynamoDB (`USE_DYNAMODB=true`).

## Technologies used
**Frontend:**
* Vue 3
* TypeScript
* Pinia
* Tailwind CSS


**Backend:**
* Node
* Express
* DynamoDB (local via Docker, AWS in production)

## How to start your local development environment

### Prerequisites
* [Install Docker for Windows](https://docs.docker.com/desktop/install/windows-install/)
* [Install Docker for MacOS](https://docs.docker.com/desktop/install/mac-install/)
* Node.js 18+ and npm

### Environment Setup

1. **Configure Environment Variables**
   
   Create environment files with your configuration:
   ```bash
   # Copy and configure backend environment
   cp amplify/backend/function/reviewersFn/src/.env.development.example amplify/backend/function/reviewersFn/src/.env.development
   
   # Copy and configure frontend environment  
   cp .env.development.example .env.development
   ```

2. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   npm run backend:install
   ```

### Starting the Application

All commands below are run from the **project root** unless noted. Make sure Docker Desktop is running
first (the local database runs in a container).

1. **Start DynamoDB Local** (Docker)
   ```bash
   npm run dynamo:start
   ```
   This starts a `dynamodb-local` container on port `8000`. Check logs with `npm run dynamo:logs`
   and stop it later with `npm run dynamo:stop`.

2. **Create the DynamoDB tables**
   ```bash
   npm run dynamo:setup
   ```
   Creates the `reviewers-app-dev`, `user-sessions-dev`, and `user-activity-dev` tables.
   > DynamoDB Local with `-inMemory` (the default in `docker-compose.dynamodb.yml`) does **not**
   > persist data across container restarts, so re-run this step (and the seed below) after each
   > `dynamo:start`.

3. **Seed sample data** (optional but recommended — see [Seeding the database](#seeding-the-database))
   ```bash
   npm run dynamo:seed
   ```

4. **Start the Backend** (Express API on port `3000`)
   ```bash
   cd amplify/backend/function/reviewersFn/src
   npm run dev
   ```
   Leave this terminal running. It loads `.env.development` and connects to local DynamoDB.

5. **Start the Frontend** (Vite dev server, usually on port `5173`)
   ```bash
   npm run dev
   ```
   Run this from the project root in a separate terminal. Ensure `.env.local` has
   `VITE_API_URL=http://localhost:3000` so the frontend reaches the local backend.

Once all are running, open the frontend URL Vite prints. You can browse videos without signing in;
posting reviews and accessing personal pages (favorites, watch history, profile) require an account.

## Seeding the database

The seed script adds a reviewer (a YouTube channel) and its recent published videos to DynamoDB so the
public video browser has content to show.

**Prerequisites:** DynamoDB Local running (`npm run dynamo:start`) and tables created
(`npm run dynamo:setup`).

```bash
# Seed the default channel (UC3XdYJjWliOdKuZMNaTiP8Q — "Z Reviews")
npm run dynamo:seed
```

To seed a different channel, pass its YouTube channel ID to the underlying script:

```bash
cd amplify/backend/function/reviewersFn/src
npm run dynamo:seed -- UCxxxxxxxxxxxxxxxxxxxxxx
```

How it works:
- It fetches the channel's profile and ~12 most recent videos from the **YouTube Data API** using the
  `YOUTUBE_API_KEY` in `amplify/backend/function/reviewersFn/src/.env.development`.
- If the API is unavailable or the key is rejected, it falls back to a small static sample set so the
  browser still has content.
- It writes the reviewer plus its videos into the `reviewers-app-dev` table and updates the reviewer's
  `numPublishedVideos` count.

Verify the seed by hitting the public endpoints (with the backend running):
```bash
curl http://localhost:3000/api/v1/reviewers
curl http://localhost:3000/api/v1/publishedVideos
```

### Security Features

This application implements comprehensive security measures including:
- JWT tokens in httpOnly cookies
- Input validation and sanitization
- Rate limiting
- CORS protection
- XSS and injection attack prevention

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## Deployment

The site is deployed to AWS with the **Amplify CLI**. The backend is an Express
app running as a Lambda (`reviewersFn`) behind API Gateway; the frontend is the
Vite-built Vue app hosted by Amplify.

```bash
amplify status     # show the active environment and resource states
amplify push       # deploy backend (Lambda + API) changes
amplify publish     # build the frontend and deploy everything
```

Active environment: **`dev`** · App ID `dyrvis20ihsc` · Region **us-east-2** (Ohio).

> ⚠️ Deploying affects the live site. The backend is mid-migration from MongoDB
> to DynamoDB — auth/sessions still need MongoDB — so review the **pre-deploy
> checklist** before pushing.

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for the full guide, verified
environment details, the pre-deploy checklist, and recovery steps.

## Website
Website is in development and is located at: https://dev.opinionrateit.com/


