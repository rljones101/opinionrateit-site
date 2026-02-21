# AWS Credentials Setup Guide

## Getting Your AWS Credentials

### Step 1: Log into AWS Console

1. Go to: https://console.aws.amazon.com/
2. Sign in with your AWS account

### Step 2: Create an IAM User (if you don't have one)

1. Go to IAM Console: https://console.aws.amazon.com/iam/
2. Click "Users" in the left sidebar
3. Click "Create user"
4. Enter username: `dynamodb-dev-user`
5. Click "Next"

### Step 3: Attach Permissions

1. Select "Attach policies directly"
2. Search for and select: `AmazonDynamoDBFullAccess`
3. Click "Next"
4. Click "Create user"

### Step 4: Create Access Keys

1. Click on the user you just created
2. Go to "Security credentials" tab
3. Scroll down to "Access keys"
4. Click "Create access key"
5. Select "Local code" as use case
6. Click "Next"
7. Add description: "DynamoDB development"
8. Click "Create access key"
9. **IMPORTANT**: Copy both:
   - Access key ID
   - Secret access key

### Step 5: Update .env.development

Replace the placeholder values in your `.env.development` file:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...your-actual-key...
AWS_SECRET_ACCESS_KEY=your-actual-secret-key-here
```

## Security Best Practices

⚠️ **IMPORTANT**: 
- Never commit your `.env.development` file to Git
- Keep your secret access key secure
- These credentials are for development only
- Use IAM roles for production

## Verify Your Credentials

After updating the file, test your credentials:

```powershell
npm run dynamo:setup:aws
```

If successful, you'll see:
```
🚀 Setting up AWS DynamoDB tables...
📍 Region: us-east-1
📋 Creating table: reviewers-app-dev
✅ Table created: reviewers-app-dev
...
🎉 All tables created successfully!
```

## Troubleshooting

### "AWS credentials not found"
- Make sure you've updated the `.env.development` file
- Check that there are no extra spaces in the credentials
- Restart your terminal/IDE after updating

### "Access Denied" or "UnauthorizedOperation"
- Verify the IAM user has `AmazonDynamoDBFullAccess` policy
- Check that you're using the correct region (us-east-1)

### "ResourceInUseException: Table already exists"
- This is normal if you've run the setup before
- The script will skip existing tables

## AWS Free Tier Limits

Your development usage will be well within free tier:
- ✅ 25 GB of storage (free forever)
- ✅ 25 read capacity units (free forever)
- ✅ 25 write capacity units (free forever)
- ✅ 2.5 million stream read requests per month

Typical development usage:
- Storage: < 100 MB
- Reads: ~1,000/day
- Writes: ~500/day
- **Cost: $0.00/month**

## Next Steps

Once your credentials are set up:

1. Create tables: `npm run dynamo:setup:aws`
2. Test DynamoDB: `npm run dynamo:test`
3. Start backend: `npm run dev:dynamo`
4. Test API: Use the test endpoints at `/api/v1/test/`