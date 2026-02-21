#!/bin/bash

# Check Amplify Deployment Status
# This script helps diagnose Amplify deployment issues

echo "=== Amplify Deployment Status Check ==="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed"
    echo "Install it from: https://aws.amazon.com/cli/"
    exit 1
fi

echo "✅ AWS CLI is installed"
echo ""

# Check current AWS region
REGION=$(aws configure get region)
echo "📍 Current AWS Region: $REGION"
echo ""

# Check if the IAM role exists
echo "🔍 Checking for IAM role..."
ROLE_NAME="opinionrateitsiteLambdaRole051027b1-dev"
if aws iam get-role --role-name $ROLE_NAME &> /dev/null; then
    echo "✅ IAM Role exists: $ROLE_NAME"
    aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text
else
    echo "❌ IAM Role NOT found: $ROLE_NAME"
    echo "   This is the cause of your deployment failure"
fi
echo ""

# Check Lambda function
echo "🔍 Checking for Lambda function..."
FUNCTION_NAME="reviewersFn-dev"
if aws lambda get-function --function-name $FUNCTION_NAME &> /dev/null; then
    echo "✅ Lambda Function exists: $FUNCTION_NAME"
    aws lambda get-function --function-name $FUNCTION_NAME --query 'Configuration.FunctionArn' --output text
else
    echo "⚠️  Lambda Function NOT found: $FUNCTION_NAME"
fi
echo ""

# List CloudFormation stacks related to Amplify
echo "🔍 Checking CloudFormation stacks..."
echo "Stacks containing 'amplify' or 'reviewersFn':"
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE UPDATE_ROLLBACK_COMPLETE --query "StackSummaries[?contains(StackName, 'amplify') || contains(StackName, 'reviewersFn')].{Name:StackName,Status:StackStatus}" --output table

echo ""
echo "=== Recommendations ==="
echo ""
if aws iam get-role --role-name $ROLE_NAME &> /dev/null; then
    echo "✅ Your IAM role exists. The issue might be elsewhere."
    echo "   Try: amplify push --force"
else
    echo "❌ Your IAM role is missing. Choose one of these options:"
    echo ""
    echo "Option 1 (Recommended): Delete and recreate the CloudFormation stack"
    echo "   1. Go to CloudFormation console"
    echo "   2. Find stack containing 'reviewersFn'"
    echo "   3. Delete the stack"
    echo "   4. Run: amplify push"
    echo ""
    echo "Option 2: Manually create the IAM role"
    echo "   1. Go to IAM console"
    echo "   2. Create role named: $ROLE_NAME"
    echo "   3. Attach AWSLambdaBasicExecutionRole policy"
    echo "   4. Run: amplify push"
    echo ""
    echo "Option 3: Reset Amplify environment"
    echo "   1. Run: amplify env remove dev"
    echo "   2. Run: amplify env add"
    echo "   3. Run: amplify push"
fi

echo ""
echo "For detailed instructions, see: docs/AMPLIFY_DEPLOYMENT_FIX.md"
