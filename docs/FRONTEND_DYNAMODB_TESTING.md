# Frontend + DynamoDB Testing Guide

## 🚀 Services Running

✅ **Backend**: http://localhost:3000 (DynamoDB)  
✅ **Frontend**: http://localhost:5173

## 🧪 Testing Scenarios

### 1. User Authentication Flow

#### Test Signup
1. Open http://localhost:5173 in your browser
2. Navigate to the signup page
3. Create a new account:
   - Name: Test User
   - Email: testuser@example.com
   - Password: testpassword123
4. **Expected**: User created in DynamoDB, redirected to dashboard

#### Test Login
1. Navigate to login page
2. Enter credentials:
   - Email: testuser@example.com
   - Password: testpassword123
3. **Expected**: Successfully logged in, JWT token stored in cookies

#### Verify in DynamoDB
1. Go to AWS Console: https://console.aws.amazon.com/dynamodbv2/home?region=us-east-2#tables
2. Click on `reviewers-app-dev` table
3. Click "Explore table items"
4. **Expected**: See your user with PK: `USER#...` and SK: `PROFILE`

### 2. Profile Management

#### View Profile
1. After logging in, navigate to profile page
2. **Expected**: See user information loaded from DynamoDB

#### Update Profile
1. Go to profile settings
2. Update fields:
   - Bio: "Testing DynamoDB integration"
   - Location: "Test City"
   - Website: "https://example.com"
3. Click "Save"
4. **Expected**: Profile updated in DynamoDB, success message shown

#### Upload Avatar
1. Go to profile page
2. Click on avatar/upload button
3. Select an image file
4. **Expected**: 
   - Image uploaded to S3
   - Avatar URL saved in DynamoDB
   - New avatar displayed immediately

### 3. Preferences Management

#### Update Preferences
1. Navigate to profile preferences
2. Toggle notification settings
3. Change theme (light/dark/auto)
4. Update privacy settings
5. **Expected**: 
   - Changes auto-saved (debounced)
   - Success message appears
   - Preferences persisted in DynamoDB

#### Verify Auto-Save
1. Make a change (e.g., toggle email notifications)
2. Wait 1 second
3. Refresh the page
4. **Expected**: Your changes are still there (loaded from DynamoDB)

### 4. Session Management

#### View Active Sessions
1. Navigate to security/sessions page
2. **Expected**: See current session with device info

#### Login from Multiple Devices
1. Open browser in incognito/private mode
2. Login with same credentials
3. Go back to original session
4. Navigate to sessions page
5. **Expected**: See 2 active sessions listed

#### Revoke Session
1. Click "Revoke" on a session
2. **Expected**: Session removed from list and DynamoDB

### 5. Activity Timeline

#### View Activity
1. Navigate to activity/timeline page
2. **Expected**: See recent activities:
   - Account created
   - Profile updated
   - Login events

#### Filter Activities
1. Use activity type filter
2. Select "Profile Updates"
3. **Expected**: Only profile update activities shown

## 🔍 Debugging

### Check Backend Logs
The backend process is running. To see logs:
1. Check the terminal where backend is running
2. Look for DynamoDB operation logs
3. Any errors will appear here

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for API request/response logs
4. Check Network tab for API calls

### Check DynamoDB Data
1. AWS Console: https://console.aws.amazon.com/dynamodbv2/home?region=us-east-2#tables
2. Select table: `reviewers-app-dev`
3. Click "Explore table items"
4. View actual data stored

### API Test Endpoints
You can also test directly via API:

```powershell
# Check database status
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/test/database-status" -UseBasicParsing

# Create test user
$body = @{
  name="API Test"
  email="apitest@example.com"
  password="test123"
  passwordConfirm="test123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/test/dynamo/signup" `
  -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

## 🐛 Common Issues

### Issue: "Network Error" or "Failed to fetch"
**Solution**: 
- Check backend is running on port 3000
- Check CORS settings in backend
- Verify API_URL in frontend .env

### Issue: "Unauthorized" or "Not logged in"
**Solution**:
- Check JWT token in cookies (DevTools > Application > Cookies)
- Try logging in again
- Check token expiration

### Issue: "User not found" after signup
**Solution**:
- Check DynamoDB table in AWS Console
- Verify user was created (look for PK: USER#...)
- Check backend logs for errors

### Issue: Changes not persisting
**Solution**:
- Check browser console for errors
- Verify API calls are successful (Network tab)
- Check DynamoDB table for updated data
- Ensure you're using DynamoDB (not MongoDB)

## 📊 Performance Testing

### Compare MongoDB vs DynamoDB

1. **Switch to MongoDB**:
   ```env
   # In amplify/backend/function/reviewersFn/src/.env.development
   USE_MONGODB=true
   USE_DYNAMODB=false
   ```
   Restart backend: `npm run dev:mongo`

2. **Test same operations**:
   - Signup
   - Login
   - Profile update
   - Preferences update

3. **Measure response times**:
   - Open DevTools > Network tab
   - Look at API call durations
   - Compare DynamoDB vs MongoDB

4. **Switch back to DynamoDB**:
   ```env
   USE_MONGODB=false
   USE_DYNAMODB=true
   ```
   Restart backend: `npm run dev:dynamo`

## ✅ Success Criteria

Your DynamoDB integration is working if:

- ✅ Can create new users via frontend
- ✅ Can login with created users
- ✅ Profile data loads from DynamoDB
- ✅ Profile updates save to DynamoDB
- ✅ Avatar uploads work (S3 + DynamoDB)
- ✅ Preferences auto-save to DynamoDB
- ✅ Sessions are tracked in DynamoDB
- ✅ Activity timeline shows events
- ✅ Data persists across page refreshes
- ✅ Can view data in AWS Console

## 🎯 Next Steps After Testing

Once frontend testing is successful:

1. **Implement remaining services**:
   - ReviewService
   - VideoService
   - SessionService (complete)
   - ActivityService (complete)

2. **Update all controllers**:
   - Use ServiceFactory instead of direct models
   - Support both MongoDB and DynamoDB

3. **Data migration**:
   - Export existing MongoDB data
   - Transform to DynamoDB format
   - Import to DynamoDB tables

4. **Production deployment**:
   - Update environment variables
   - Deploy to AWS
   - Monitor performance

## 📝 Test Checklist

Use this checklist while testing:

- [ ] Frontend loads successfully
- [ ] Backend API responds
- [ ] Can create new user account
- [ ] Can login with credentials
- [ ] JWT token stored in cookies
- [ ] Profile page loads user data
- [ ] Can update profile information
- [ ] Can upload avatar image
- [ ] Preferences auto-save works
- [ ] Can view active sessions
- [ ] Activity timeline shows events
- [ ] Data visible in AWS Console
- [ ] Changes persist after refresh
- [ ] Logout works correctly
- [ ] Can login again after logout

---

**Happy Testing! 🎉**

If you encounter any issues, check the debugging section above or review the backend logs.