# 🚀 Quick Start - DynamoDB Full Stack

## ✅ Currently Running

| Service | URL | Status | Database |
|---------|-----|--------|----------|
| **Backend** | http://localhost:3000 | ✅ Running | DynamoDB (AWS) |
| **Frontend** | http://localhost:5173 | ✅ Running | - |

## 🎯 Quick Test

1. **Open Frontend**: http://localhost:5173
2. **Create Account**: Sign up with any email/password
3. **Check DynamoDB**: https://console.aws.amazon.com/dynamodbv2/home?region=us-east-2#tables
4. **View Data**: Click `reviewers-app-dev` → "Explore table items"

## 📊 DynamoDB Tables

| Table Name | Purpose | Items |
|------------|---------|-------|
| `reviewers-app-dev` | Users, reviews, videos | Active |
| `user-sessions-dev` | Session management | Active |
| `user-activity-dev` | Activity tracking | Active |

## 🧪 Test Endpoints

```powershell
# Database status
Invoke-WebRequest http://localhost:3000/api/v1/test/database-status -UseBasicParsing

# Create user
$body = '{"name":"Test","email":"test@test.com","password":"test123","passwordConfirm":"test123"}' 
Invoke-WebRequest http://localhost:3000/api/v1/test/dynamo/signup -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

## 🔄 Switch Databases

### Use DynamoDB (Current)
```env
USE_MONGODB=false
USE_DYNAMODB=true
```

### Use MongoDB
```env
USE_MONGODB=true
USE_DYNAMODB=false
```

Then restart: `npm run dev:dynamo` or `npm run dev:mongo`

## 📝 Key Files

- `DYNAMODB_SUCCESS.md` - Complete success documentation
- `FRONTEND_DYNAMODB_TESTING.md` - Frontend testing guide
- `test-dynamodb-api.http` - API test examples
- `.env.development` - Configuration

## 🛠️ Useful Commands

```powershell
# Backend
npm run dev:dynamo          # Start with DynamoDB
npm run dev:mongo           # Start with MongoDB
npm run dynamo:test         # Test DynamoDB operations
npm run dynamo:test:credentials  # Test AWS credentials

# Frontend
npm run dev                 # Start frontend

# Testing
npm run dynamo:setup:aws    # Create/reset tables
```

## 🎉 What's Working

✅ User signup/login with DynamoDB  
✅ Profile management  
✅ Avatar upload (S3 + DynamoDB)  
✅ Preferences auto-save  
✅ Session tracking  
✅ Activity timeline  
✅ JWT authentication  
✅ Password hashing  
✅ Email-based lookup  

## 📍 AWS Resources

**Region**: us-east-2 (Ohio)  
**Console**: https://console.aws.amazon.com/dynamodbv2/home?region=us-east-2  
**Cost**: $0.00/month (Free Tier)  

## 🐛 Troubleshooting

### Backend not responding?
```powershell
# Check process
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# Restart
npm run dev:dynamo
```

### Frontend not loading?
```powershell
# Check port 5173
netstat -an | findstr :5173

# Restart
npm run dev
```

### DynamoDB errors?
```powershell
# Test credentials
npm run dynamo:test:credentials

# Check tables
npm run dynamo:test
```

## 📚 Documentation

- **Setup**: `DYNAMODB_SETUP.md`
- **Windows**: `WINDOWS_SETUP.md`
- **Testing**: `FRONTEND_DYNAMODB_TESTING.md`
- **Success**: `DYNAMODB_SUCCESS.md`

---

**Status**: ✅ FULLY OPERATIONAL  
**Last Updated**: February 15, 2026  
**Next**: Test with frontend at http://localhost:5173