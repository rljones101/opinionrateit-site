# DynamoDB Setup for Windows

You have two options for local DynamoDB development on Windows:

## Option 1: DynamoDB Local (Requires Java)

### Install Java

1. **Download Java:**
   - Go to: https://www.oracle.com/java/technologies/downloads/#jdk21-windows
   - Download "Windows x64 Installer" (jdk-21_windows-x64_bin.exe)
   - Run the installer

2. **Verify Java Installation:**
   ```powershell
   java -version
   ```
   
   You should see something like:
   ```
   java version "21.0.1" 2023-10-17 LTS
   ```

3. **Start DynamoDB Local:**
   ```powershell
   cd amplify/backend/function/reviewersFn/src
   npm run dynamo:start
   ```

### Quick Setup Commands (PowerShell)

```powershell
# 1. Install dependencies (already done)
cd amplify/backend/function/reviewersFn/src
npm install

# 2. Create tables
npm run dynamo:setup

# 3. Test DynamoDB
npm run dynamo:test

# 4. Start backend with DynamoDB
npm run dev:dynamo
```

## Option 2: Use AWS DynamoDB Directly (No Java Required) ⭐ RECOMMENDED

This option uses actual AWS DynamoDB with free tier, avoiding Java installation.

### Setup Steps

1. **Update `.env.development`:**
   ```env
   # Database Configuration
   USE_MONGODB=false
   USE_DYNAMODB=true

   # AWS DynamoDB Configuration (use your actual AWS credentials)
   # DYNAMODB_ENDPOINT=http://localhost:8000  # Comment this out for AWS
   DYNAMODB_REGION=us-east-1
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-actual-access-key
   AWS_SECRET_ACCESS_KEY=your-actual-secret-key
   DYNAMODB_TABLE_PREFIX=dev
   ```

2. **Create Tables in AWS:**
   
   We'll create a script that works with AWS DynamoDB:
   
   ```powershell
   # This will create tables in your AWS account
   npm run dynamo:setup:aws
   ```

3. **Test with AWS DynamoDB:**
   ```powershell
   npm run dynamo:test
   ```

4. **Start Backend:**
   ```powershell
   npm run dev:dynamo
   ```

### AWS Free Tier Benefits

- **25 GB of storage** - Free forever
- **25 read/write capacity units** - Free forever
- **2.5 million stream read requests** - Free forever
- **Perfect for development** - More than enough for testing

### Cost Estimate for Development

With typical development usage:
- **Reads**: ~1,000 per day = FREE (well under 25 units)
- **Writes**: ~500 per day = FREE (well under 25 units)
- **Storage**: < 1 GB = FREE
- **Total**: $0.00/month

## Option 3: Docker (Alternative)

If you have Docker installed:

```powershell
# Run DynamoDB in Docker (no Java needed)
docker run -p 8000:8000 amazon/dynamodb-local

# In another terminal
npm run dynamo:setup
npm run dev:dynamo
```

## Recommended Approach for You

Since Java isn't installed, I recommend **Option 2 (AWS DynamoDB)** because:

1. ✅ No Java installation needed
2. ✅ Free tier covers all development needs
3. ✅ More realistic testing (actual AWS environment)
4. ✅ Easier setup on Windows
5. ✅ Better performance than local
6. ✅ Can access from anywhere

## Testing Without DynamoDB (Continue with MongoDB)

If you want to continue with MongoDB while we set up DynamoDB:

```powershell
# Use MongoDB (your current setup)
npm run dev:mongo
```

You can switch to DynamoDB later when ready.

## Next Steps

Choose your preferred option and let me know. I can help you:

1. **Install Java** and set up DynamoDB Local
2. **Configure AWS DynamoDB** for development (recommended)
3. **Set up Docker** if you have it installed
4. **Continue with MongoDB** and migrate later

Which option would you like to proceed with?