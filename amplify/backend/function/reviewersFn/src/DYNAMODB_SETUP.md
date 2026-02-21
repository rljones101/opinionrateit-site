# DynamoDB Local Development Setup

This guide will help you set up and test the DynamoDB migration locally.

## Prerequisites

- Java 8+ (required for DynamoDB Local)
- Node.js and npm
- Your existing MongoDB setup (for comparison testing)

## Setup Steps

### 1. Install Java (if not already installed)

**Windows:**
```bash
# Check if Java is installed
java -version

# If not installed, download from: https://www.oracle.com/java/technologies/downloads/
```

**macOS:**
```bash
# Using Homebrew
brew install openjdk@11
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-11-jdk
```

### 2. Download DynamoDB Local

```bash
# Navigate to your backend directory
cd amplify/backend/function/reviewersFn/src

# Create directory for DynamoDB Local
mkdir dynamodb-local
cd dynamodb-local

# Download DynamoDB Local
curl -O https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.zip

# Extract
unzip dynamodb_local_latest.zip

# Go back to src directory
cd ..
```

### 3. Install New Dependencies

```bash
# Install DynamoDB SDK packages
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

### 4. Configure Environment

Update your `.env.development` file:

```env
# Database Configuration - Choose one or both for testing
USE_MONGODB=true
USE_DYNAMODB=false

# DynamoDB Configuration (for local development)
DYNAMODB_ENDPOINT=http://localhost:8000
DYNAMODB_REGION=local
DYNAMODB_ACCESS_KEY_ID=fake
DYNAMODB_SECRET_ACCESS_KEY=fake
DYNAMODB_TABLE_PREFIX=dev
```

## Testing the Setup

### 1. Start DynamoDB Local

```bash
# Terminal 1: Start DynamoDB Local
npm run dynamo:start
```

You should see output like:
```
Initializing DynamoDB Local with the following configuration:
Port:	8000
InMemory:	false
DbPath:	null
SharedDb:	true
shouldDelayTransientStatuses:	false
CorsParams:	*
```

### 2. Create Tables

```bash
# Terminal 2: Create DynamoDB tables
npm run dynamo:setup
```

Expected output:
```
🚀 Setting up local DynamoDB tables...
📋 Creating table: reviewers-app-dev
✅ Table created: reviewers-app-dev
📋 Creating table: user-sessions-dev
✅ Table created: user-sessions-dev
📋 Creating table: user-activity-dev
✅ Table created: user-activity-dev
🎉 All tables created successfully!
```

### 3. Test DynamoDB Operations

```bash
# Terminal 3: Test DynamoDB functionality
npm run dynamo:test
```

Expected output:
```
🧪 Testing DynamoDB setup...
✅ Database connection successful
✅ User service created
📝 Testing user creation...
✅ User created: { userId: '...', name: 'Test User', email: 'test@example.com' }
🔍 Testing user retrieval by ID...
✅ User retrieved by ID: SUCCESS
📧 Testing user retrieval by email...
✅ User retrieved by email: SUCCESS
✏️  Testing user update...
✅ User updated: Updated bio for test user
🔐 Testing password comparison...
✅ Password comparison: SUCCESS
🗑️  Cleaning up test user...
✅ Test user deleted
🎉 All DynamoDB tests passed!
```

### 4. Start Backend with DynamoDB

```bash
# Terminal 4: Start backend using DynamoDB
npm run dev:dynamo
```

### 5. Test API Endpoints

```bash
# Check database status
curl http://localhost:3000/api/v1/test/database-status

# Test DynamoDB user creation
curl -X POST http://localhost:3000/api/v1/test/dynamo/test-user \
  -H "Content-Type: application/json"

# Test DynamoDB signup
curl -X POST http://localhost:3000/api/v1/test/dynamo/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "testpassword123",
    "passwordConfirm": "testpassword123"
  }'

# Test DynamoDB login
curl -X POST http://localhost:3000/api/v1/test/dynamo/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpassword123"
  }'
```

### 6. View Data (Optional)

```bash
# Terminal 5: Start admin interface
npm run dynamo:admin

# Open browser to http://localhost:8001
```

## Development Workflow

### Daily Development

1. **Start DynamoDB Local** (Terminal 1):
   ```bash
   npm run dynamo:start
   ```

2. **Start Backend** (Terminal 2):
   ```bash
   # For DynamoDB development
   npm run dev:dynamo
   
   # For MongoDB development (existing)
   npm run dev:mongo
   
   # For both (testing comparison)
   npm run dev
   ```

3. **Start Frontend** (Terminal 3, from project root):
   ```bash
   npm run dev
   ```

### Switching Between Databases

You can easily switch between MongoDB and DynamoDB by changing environment variables:

**For DynamoDB:**
```env
USE_MONGODB=false
USE_DYNAMODB=true
```

**For MongoDB:**
```env
USE_MONGODB=true
USE_DYNAMODB=false
```

**For Both (comparison testing):**
```env
USE_MONGODB=true
USE_DYNAMODB=true
```

### Testing Both Implementations

```bash
# Test MongoDB signup
curl -X POST http://localhost:3000/api/v1/test/mongo/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Mongo User","email":"mongo@example.com","password":"test123","passwordConfirm":"test123"}'

# Test DynamoDB signup
curl -X POST http://localhost:3000/api/v1/test/dynamo/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Dynamo User","email":"dynamo@example.com","password":"test123","passwordConfirm":"test123"}'
```

## Troubleshooting

### Java Issues
```bash
# Check Java version
java -version

# Should show Java 8 or higher
```

### DynamoDB Local Won't Start
```bash
# Check if port 8000 is in use
netstat -an | grep 8000

# Kill process using port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Kill process using port 8000 (macOS/Linux)
lsof -ti:8000 | xargs kill -9
```

### Tables Not Created
```bash
# Check DynamoDB Local is running
curl http://localhost:8000

# Recreate tables
npm run dynamo:setup
```

### Connection Errors
- Ensure DynamoDB Local is running on port 8000
- Check that `DYNAMODB_ENDPOINT=http://localhost:8000` in your `.env.development`
- Verify no firewall is blocking port 8000

## Next Steps

Once you have the basic setup working:

1. **Test existing API endpoints** with DynamoDB
2. **Compare performance** between MongoDB and DynamoDB
3. **Implement remaining services** (Reviews, Videos, etc.)
4. **Test data migration** scripts
5. **Update frontend** to work with both backends

## Useful Commands

```bash
# Quick setup (run once)
npm run dynamo:setup

# Daily development
npm run dynamo:start     # Terminal 1
npm run dev:dynamo       # Terminal 2

# Testing
npm run dynamo:test      # Test DynamoDB operations
npm run dynamo:admin     # View data in browser

# Cleanup
# Stop DynamoDB Local with Ctrl+C
# Tables are persisted between restarts
```