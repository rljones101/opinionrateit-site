# opinionrateit-site
Created in May 2023 - by Rick Jones


## Description
This is a project that I am currently working that shows off some of my development skills that use 
frontend technologies such as `Vue 3, Pinia, HTML CSS / Tailwind CSS`. I am also using Amplify CLI to 
create the backend using Express which then communicates to a MongoDB through a VPC that was created in AWS.

## Technologies used
**Frontend:**
* Vue 3 
* Typescript 
* Pinia 
* HTML
* CSS


**Backend:** 
* Node
* Express
* MongoDB

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

1. **Start MongoDB**
   ```bash
   npm run mongo:start
   ```

2. **Start the Backend**
   ```bash
   npm run backend:dev
   ```

3. **Start the Frontend**
   ```bash
   npm run dev
   ```

4. **View Running Containers**
   ```bash
   npm run mongo:log
   ```

### Security Features

This application implements comprehensive security measures including:
- JWT tokens in httpOnly cookies
- Input validation and sanitization
- Rate limiting
- CORS protection
- XSS and injection attack prevention

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

## Website
Website is in development and is located at: https://dev.opinionrateit.com/


