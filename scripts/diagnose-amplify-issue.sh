#!/bin/bash

# Amplify Deployment Diagnostic Script
# This script checks the current state of your Amplify resources

echo "=========================================="
echo "Amplify Deployment Diagnostic"
echo "=========================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "   Visit: https://aws.amazon.com/cli/"
    exit 1
fi

echo "✅ AWS CLI is installed"
echo ""

# Get current AWS region
REGION=$(aws configure get region)
if [ -z "$REGION" ]; then
    echo "⚠️  No default region configured. Using us-east-1"
    REGION="us-east-1"
else
    echo "📍 Region: $REGION"
fi
echo ""

# Check for CloudFormation stacks related to reviewersFn
echo "🔍 Checking CloudFormation stacks..."
echo "---"
aws cloudformation list-stacks \
    --region "$REGION" \
    --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE UPDATE_ROLLBACK_COMPLETE ROLLBACK_COMPLETE \
    --query "StackSummaries[?contains(StackName, 'reviewersFn')].{Name:StackName,Status:StackStatus,Created:CreationTime}" \
    --output table

echo ""

# Check for the specific IAM role
echo "🔍 Checking IAM role: opinionrateitsiteLambdaRole051027b1-dev"
echo "---"
if aws iam get-role --role-name opinionrateitsiteLambdaRole051027b1-dev &> /dev/null; then
    echo "✅ Role exists"
    aws iam get-role --role-name opinionrateitsiteLambdaRole051027b1-dev \
        --query "Role.{Name:RoleName,Created:CreateDate,Arn:Arn}" \
        --output table
else
    echo "❌ Role does NOT exist - This is the problem!"
fi
echo ""

# Check for Lambda function
echo "🔍 Checking Lambda function: reviewersFn-dev"
echo "---"
if aws lambda get-function --function-name reviewersFn-dev --region "$REGION" &> /dev/null; then
    echo "✅ Lambda function exists"
    aws lambda get-function --function-name reviewersFn-dev --region "$REGION" \
        --query "Configuration.{Name:FunctionName,Runtime:Runtime,Role:Role}" \
        --output table
else
    echo "⚠️  Lambda function does NOT exist"
fi
echo ""

# Check Amplify environment
echo "🔍 Checking Amplify environment..."
echo "---"
if [ -f "amplify/.config/local-env-info.json" ]; then
    echo "Current environment:"
    cat amplify/.config/local-env-info.json | grep -E '"envName"|"defaultEditor"'
else
    echo "⚠️  No local environment info found"
fi
echo ""

echo "=========================================="
echo "Recommended Actions:"
echo "=========================================="
echo ""
echo "Based on the diagnostic results above:"
echo ""
echo "1. If the IAM role does NOT exist:"
echo "   → Delete the CloudFormation stack and run 'amplify push'"
echo "   → Or manually create the role in IAM console"
echo ""
echo "2. If the CloudFormation stack shows ROLLBACK or FAILED status:"
echo "   → Delete the stack and run 'amplify push'"
echo ""
echo "3. If multiple stacks exist for reviewersFn:"
echo "   → Delete old/failed stacks, keep only the active one"
echo ""
echo "See docs/AMPLIFY_DEPLOYMENT_FIX.md for detailed instructions"
echo ""
