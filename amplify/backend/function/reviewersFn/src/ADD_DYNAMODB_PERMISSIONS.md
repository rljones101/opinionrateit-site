# Add DynamoDB Permissions to Existing IAM User

Your AWS credentials are working! However, your IAM user `opnionrateit-s3-uploader` currently only has S3 permissions. We need to add DynamoDB permissions.

## Option 1: Add Permissions via AWS Console (Easiest)

### Step 1: Go to IAM Console
1. Open: https://console.aws.amazon.com/iam/
2. Click "Users" in the left sidebar
3. Find and click on: `opnionrateit-s3-uploader`

### Step 2: Add DynamoDB Policy
1. Click the "Permissions" tab
2. Click "Add permissions" → "Attach policies directly"
3. Search for: `AmazonDynamoDBFullAccess`
4. Check the box next to it
5. Click "Add permissions"

### Step 3: Verify
Run this command to test:
```powershell
npm run dynamo:test:credentials
```

You should see:
```
✅ Successfully connected to DynamoDB!
🎉 Your AWS credentials are working correctly!
```

## Option 2: Add Inline Policy (More Restrictive - Recommended for Production)

If you want more control, add a custom policy:

### Step 1: Go to IAM User
1. Open: https://console.aws.amazon.com/iam/
2. Click "Users" → `opnionrateit-s3-uploader`
3. Click "Permissions" tab
4. Click "Add permissions" → "Create inline policy"

### Step 2: Add This Policy
Click "JSON" tab and paste:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem",
                "dynamodb:DescribeTable",
                "dynamodb:CreateTable",
                "dynamodb:ListTables"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-2:399951027632:table/*-dev",
                "arn:aws:dynamodb:us-east-2:399951027632:table/*-dev/index/*"
            ]
        }
    ]
}
```

### Step 3: Name and Create
1. Name: `DynamoDBDevelopmentAccess`
2. Click "Create policy"

## Option 3: Create New IAM User (Alternative)

If you prefer to keep S3 and DynamoDB separate:

1. Create new user: `opinionrateit-dynamodb-dev`
2. Attach policy: `AmazonDynamoDBFullAccess`
3. Create access keys
4. Update `.env.development` with new credentials

## After Adding Permissions

Once permissions are added, run these commands:

```powershell
# 1. Test credentials
npm run dynamo:test:credentials

# 2. Create DynamoDB tables
npm run dynamo:setup:aws

# 3. Test DynamoDB operations
npm run dynamo:test

# 4. Start backend with DynamoDB
npm run dev:dynamo
```

## Security Note

⚠️ **For Development Only**
- These permissions are for development/testing
- For production, use more restrictive policies
- Consider using IAM roles instead of access keys
- Never commit credentials to Git

## Troubleshooting

### Still getting "Access Denied"?
- Wait 1-2 minutes for IAM changes to propagate
- Clear any cached credentials
- Restart your terminal/IDE

### Can't find the IAM user?
- Make sure you're in the correct AWS account
- Check the AWS region (should be us-east-2)

### Need help?
The error message shows your account ID: `399951027632`
Make sure you're logged into the correct AWS account.