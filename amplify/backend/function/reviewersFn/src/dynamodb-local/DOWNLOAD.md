# DynamoDB Local Setup

This directory should contain DynamoDB Local files, but they are not included in the repository due to their large size (>50MB).

## Download Instructions

1. Download DynamoDB Local from AWS:
   ```bash
   curl -O https://d1ni2b6xgvw0s0.cloudfront.net/v2.x/dynamodb_local_latest.zip
   ```

2. Extract the zip file to this directory:
   ```bash
   unzip dynamodb_local_latest.zip
   ```

3. The directory structure should look like:
   ```
   dynamodb-local/
   ├── DynamoDBLocal.jar
   ├── DynamoDBLocal_lib/
   ├── LICENSE.txt
   ├── README.txt
   ├── THIRD-PARTY-LICENSES.txt
   └── dynamodb_local_latest.zip
   ```

## Alternative: Use the Setup Script

Run the setup script from the project root:
```bash
cd amplify/backend/function/reviewersFn/src
node scripts/setup-local-dynamodb.js
```

This will automatically download and extract DynamoDB Local for you.

## Note

These files are excluded from git via `.gitignore` to keep the repository size manageable.
