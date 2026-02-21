# Stripe Setup Guide

## Current Issue

**Error**: `503 Service Unavailable` when calling `/api/v1/stripe/create-customer`

**Cause**: Stripe secret key is not configured (still using placeholder value)

## Quick Fix

### Step 1: Get Your Stripe Test Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/test/apikeys
2. **Copy your keys**:
   - **Publishable key**: Starts with `pk_test_...`
   - **Secret key**: Starts with `sk_test_...` (click "Reveal test key")

### Step 2: Update Backend Environment

Update `amplify/backend/function/reviewersFn/src/.env.development`:

```env
# Replace these with your actual Stripe test keys
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 3: Update Frontend Environment

Create or update `.env.development` in your project root:

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

### Step 4: Restart Backend

```powershell
# Stop the current backend (if running)
# Then restart with:
npm run dev:dynamo
```

## Testing Stripe Integration

### Test Card Numbers

Once configured, use these test cards:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | 3D Secure required |
| `4000 0000 0000 9995` | Insufficient funds |

**Expiry**: Any future date (e.g., `12/34`)  
**CVC**: Any 3 digits (e.g., `123`)  
**ZIP**: Any 5 digits (e.g., `12345`)

## Stripe Dashboard Setup

### 1. Create Products (Optional)

If you're using subscriptions:

1. Go to: https://dashboard.stripe.com/test/products
2. Click "Add product"
3. Set up your pricing tiers:
   - **Basic Plan**: $9.99/month
   - **Plus Plan**: $19.99/month
4. Note the Price IDs (starts with `price_...`)

### 2. Set Up Webhooks (For Production)

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://your-domain.com/api/v1/stripe/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook secret (starts with `whsec_...`)

### 3. Test Webhooks Locally

Use Stripe CLI for local webhook testing:

```powershell
# Install Stripe CLI
# Download from: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/v1/stripe/webhook

# Test a webhook
stripe trigger payment_intent.succeeded
```

## Verify Configuration

### Check Backend Logs

After restarting, you should see:
```
✅ Stripe initialized successfully
```

If you see:
```
⚠️  Stripe not configured - using placeholder key
```
Then your key is still not set correctly.

### Test API Endpoint

```powershell
# Test create customer
$body = @{
  email="test@example.com"
  name="Test Customer"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/stripe/create-customer" `
  -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

**Expected Response**:
```json
{
  "status": "success",
  "data": {
    "customer": {
      "id": "cus_...",
      "email": "test@example.com",
      "name": "Test Customer"
    }
  }
}
```

## Common Issues

### Issue: Still getting 503 error

**Solutions**:
1. Verify key starts with `sk_test_`
2. No quotes around the key in .env file
3. Restart backend after changing .env
4. Check backend logs for Stripe initialization

### Issue: "Invalid API Key"

**Solutions**:
1. Make sure you're using the **test** key (not live)
2. Key should start with `sk_test_` not `sk_live_`
3. Copy the entire key (they're long!)
4. No extra spaces before/after the key

### Issue: Webhook signature verification failed

**Solutions**:
1. Use Stripe CLI for local testing
2. Or comment out webhook secret verification in development:
   ```javascript
   // In stripeController.js
   const endpointSecret = process.env.NODE_ENV === 'production' 
     ? process.env.STRIPE_WEBHOOK_SECRET 
     : null
   ```

## Security Notes

⚠️ **Important**:
- Never commit `.env` files to Git
- Use test keys for development (`sk_test_...`)
- Use live keys only in production (`sk_live_...`)
- Rotate keys if accidentally exposed
- Use environment variables, not hardcoded keys

## Frontend Integration Example

Once backend is configured, use Stripe in your frontend:

```typescript
// src/services/stripeService.ts
import { apiPost } from './AppApi'

export const createCustomer = async (email: string, name: string) => {
  return await apiPost('/stripe/create-customer', { email, name })
}

export const createPaymentIntent = async (lookupKey: string, customerId: string) => {
  return await apiPost('/stripe/create-intent', {
    lookupKey,
    customer: customerId
  })
}
```

```vue
<!-- In your component -->
<script setup lang="ts">
import { createCustomer } from '@/services/stripeService'

const handleSignup = async () => {
  try {
    const response = await createCustomer(email.value, name.value)
    console.log('Customer created:', response.data.customer)
  } catch (error) {
    console.error('Stripe error:', error)
  }
}
</script>
```

## Next Steps

1. ✅ Get Stripe test keys from dashboard
2. ✅ Update `.env.development` with real keys
3. ✅ Restart backend
4. ✅ Test customer creation endpoint
5. ✅ Implement payment flow in frontend
6. ✅ Test with test card numbers
7. ✅ Set up webhooks for production

---

**Quick Start**:
1. Get keys: https://dashboard.stripe.com/test/apikeys
2. Update: `amplify/backend/function/reviewersFn/src/.env.development`
3. Restart: `npm run dev:dynamo`
4. Test: Create a customer via API

**Need Help?**
- Stripe Docs: https://stripe.com/docs
- Test Cards: https://stripe.com/docs/testing
- API Reference: https://stripe.com/docs/api