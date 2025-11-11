// Test S3 Credentials
const { S3Client, ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: './amplify/backend/function/reviewersFn/src/.env.local' });

console.log('\n=== S3 Credentials Test ===\n');

// Check environment variables
console.log('Environment Variables:');
console.log('  S3_AVATAR_BUCKET:', process.env.S3_AVATAR_BUCKET || '❌ NOT SET');
console.log('  AWS_REGION:', process.env.AWS_REGION || '❌ NOT SET');
console.log('  AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? `${process.env.AWS_ACCESS_KEY_ID.substring(0, 8)}...` : '❌ NOT SET');
console.log('  AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '****** (set)' : '❌ NOT SET');
console.log('');

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.log('❌ AWS credentials not found in .env.local');
  console.log('   Please add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to:');
  console.log('   amplify/backend/function/reviewersFn/src/.env.local');
  process.exit(1);
}

// Initialize S3 client
const s3Client = new S3Client({
  region: proces