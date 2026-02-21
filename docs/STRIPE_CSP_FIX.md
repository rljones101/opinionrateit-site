# Stripe Content Security Policy Fix

## ✅ Issue Resolved

The CSP error blocking Stripe has been fixed!

### What Was Changed

Updated the Helmet CSP configuration in `app.js` to allow Stripe domains:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "https://js.stripe.com"],  // ✅ Added Stripe
      frameSrc: [
        "'self'", 
        "https://js.stripe.com",      // ✅ Added for Stripe iframes
        "https://hooks.stripe.com",   // ✅ Added for Stripe webhooks
        "https://www.youtube.com"     // Existing YouTube support
      ],
      connectSrc: [
        "'self'", 
        "https://api.stripe.com",     // ✅ Added for Stripe API calls
        process.env.NODE_ENV === 'development' 
          ? "http://localhost:5173" 
          : "https://dev.opinionrateit.com"
      ]
    }
  },
  crossOriginEmbedderPolicy: false
}))
```

### Stripe Domains Added

1. **`scriptSrc`**: `https://js.stripe.com`
   - Allows loading Stripe.js library

2. **`frameSrc`**: 
   - `https://js.stripe.com` - Stripe payment elements/iframes
   - `https://hooks.stripe.com` - Stripe webhook handling

3. **`connectSrc`**: `https://api.stripe.com`
   - Allows API calls to Stripe backend

## 🧪 Testing Stripe Integration

### 1. Refresh Your Browser

Clear the error by refreshing the page:
- Press `Ctrl + Shift + R` (hard refresh)
- Or `Ctrl + F5`

### 2. Check Console

Open DevTools (F12) → Console tab
- The CSP error should be gone
- Stripe should load successfully

### 3. Test Stripe Elements

If you're using Stripe Elements:
```javascript
// This should now work without CSP errors
const stripe = await loadStripe('your_publishable_key')
const elements = stripe.elements()
const cardElement = elements.create('card')
cardElement.mount('#card-element')
```

## 🔧 Stripe Configuration

### Environment Variables

Make sure you have Stripe keys in your `.env.development`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend Configuration

In your Vue.js app, you might have:

```javascript
// src/config/stripe.js or similar
import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
)
```

Make sure your frontend `.env.development` has:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🎯 Common Stripe Use Cases

### 1. Payment Intent (Recommended)

```javascript
// Backend - Create payment intent
app.post('/api/v1/stripe/create-payment-intent', async (req, res) => {
  const { amount } = req.body
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  })
  
  res.json({ clientSecret: paymentIntent.client_secret })
})

// Frontend - Process payment
const { error } = await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: 'http://localhost:5173/payment-success',
  },
})
```

### 2. Subscription

```javascript
// Backend - Create subscription
app.post('/api/v1/stripe/create-subscription', async (req, res) => {
  const { customerId, priceId } = req.body
  
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  })
  
  res.json({
    subscriptionId: subscription.id,
    clientSecret: subscription.latest_invoice.payment_intent.client_secret,
  })
})
```

### 3. Webhook Handling

Your backend already has webhook endpoint at:
```
POST /api/v1/stripe/webhook
```

Make sure it's configured in Stripe Dashboard:
1. Go to: https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://your-domain.com/api/v1/stripe/webhook`
3. Select events to listen for
4. Copy webhook secret to `.env`

## 🐛 Troubleshooting

### Still seeing CSP errors?

1. **Hard refresh**: `Ctrl + Shift + R`
2. **Clear cache**: DevTools → Network → Disable cache
3. **Check backend restarted**: Backend should show "App started"
4. **Verify CSP**: Check Network tab → Response headers → `content-security-policy`

### Stripe not loading?

1. **Check publishable key**: Make sure it starts with `pk_test_` or `pk_live_`
2. **Check network**: DevTools → Network → Look for `js.stripe.com` requests
3. **Check console**: Look for Stripe-specific errors

### Webhook not working?

1. **Test locally**: Use Stripe CLI
   ```bash
   stripe listen --forward-to localhost:3000/api/v1/stripe/webhook
   ```

2. **Check signature**: Verify webhook secret matches
3. **Check logs**: Backend should log webhook events

## 📚 Stripe Resources

- **Dashboard**: https://dashboard.stripe.com/test/dashboard
- **API Docs**: https://stripe.com/docs/api
- **Testing Cards**: https://stripe.com/docs/testing
- **Webhooks**: https://stripe.com/docs/webhooks

### Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

Use any future expiry date and any 3-digit CVC.

## ✅ Verification Checklist

- [x] CSP updated to allow Stripe domains
- [x] Backend restarted with new configuration
- [ ] Browser refreshed (hard refresh)
- [ ] Stripe loads without CSP errors
- [ ] Can create payment elements
- [ ] Can process test payments
- [ ] Webhooks configured (if needed)

---

**Status**: ✅ Stripe CSP Fixed

Your Stripe integration should now work without CSP errors. Refresh your browser and test!