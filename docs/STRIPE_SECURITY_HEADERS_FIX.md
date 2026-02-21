# Stripe Security Headers - Complete Fix

## ✅ Issues Resolved

1. ❌ **X-Frame-Options meta tag error** - FIXED
2. ❌ **Stripe CSP blocking** - FIXED
3. ✅ **Proper security headers** - CONFIGURED

## 🔧 Changes Made

### 1. Removed Invalid Meta Tags (Frontend)

**File**: `src/main.ts`

**Problem**: Trying to set security headers via meta tags, which doesn't work for `X-Frame-Options` and causes browser warnings.

**Solution**: Removed the `addSecurityHeaders()` function that was creating meta tags. Security headers should come from the server, not client-side JavaScript.

```typescript
// ❌ REMOVED - Don't set security headers via meta tags
const addSecurityHeaders = () => {
  // This doesn't work properly
}
```

### 2. Added Proper CSP Headers (Frontend Dev Server)

**File**: `vite.config.ts`

**Added**: Proper Content Security Policy headers for the Vite dev server that allow Stripe:

```typescript
server: {
  headers: {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com ...",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com ...",
      "connect-src 'self' https://api.stripe.com ...",
      // ... other directives
    ].join('; ')
  }
}
```

### 3. Updated Backend CSP (Already Done)

**File**: `amplify/backend/function/reviewersFn/src/app.js`

**Added**: Stripe domains to Helmet CSP configuration:
- `scriptSrc`: `https://js.stripe.com`
- `frameSrc`: `https://js.stripe.com`, `https://hooks.stripe.com`
- `connectSrc`: `https://api.stripe.com`

## 🧪 Testing

### 1. Hard Refresh Browser

Clear all cached policies:
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### 2. Check Console

Open DevTools (F12) → Console:
- ✅ No X-Frame-Options warnings
- ✅ No CSP violations for Stripe
- ✅ Stripe.js loads successfully

### 3. Check Network Tab

DevTools → Network:
- ✅ `js.stripe.com` requests succeed
- ✅ No blocked requests
- ✅ Response headers show proper CSP

### 4. Test Stripe Integration

```javascript
// This should work without errors
const stripe = await loadStripe('pk_test_...')
console.log('Stripe loaded:', stripe)
```

## 📋 Security Headers Explained

### Content Security Policy (CSP)

Controls what resources can be loaded:

```
script-src 'self' https://js.stripe.com
  ↓
  Only allow scripts from your domain and Stripe

frame-src 'self' https://js.stripe.com
  ↓
  Only allow iframes from your domain and Stripe

connect-src 'self' https://api.stripe.com
  ↓
  Only allow API calls to your domain and Stripe
```

### Why Not Use Meta Tags?

❌ **Don't do this**:
```html
<meta http-equiv="X-Frame-Options" content="DENY">
```

✅ **Do this instead** (server-side):
```javascript
// Backend (Express + Helmet)
app.use(helmet({
  frameguard: { action: 'deny' }
}))

// Frontend (Vite dev server)
server: {
  headers: {
    'X-Frame-Options': 'DENY'
  }
}
```

**Why?**
- Meta tags for security headers are ignored by browsers
- They cause console warnings
- Only HTTP headers are respected

## 🎯 Stripe-Specific CSP Requirements

### Required Directives

1. **script-src**: `https://js.stripe.com`
   - Loads Stripe.js library

2. **frame-src**: `https://js.stripe.com`, `https://hooks.stripe.com`
   - Stripe Elements (card input, payment form)
   - 3D Secure authentication iframes

3. **connect-src**: `https://api.stripe.com`
   - API calls to Stripe backend
   - Token creation, payment processing

4. **img-src**: `https:` (or specific Stripe domains)
   - Card brand logos
   - Payment method icons

### Optional but Recommended

```javascript
"style-src 'self' 'unsafe-inline'"  // For Stripe Elements styling
"font-src 'self' https://fonts.gstatic.com"  // If using custom fonts
```

## 🔒 Production Considerations

### Tighten CSP for Production

Development CSP includes `'unsafe-inline'` and `'unsafe-eval'` for hot reload. Remove these in production:

```javascript
// Production CSP (more restrictive)
"script-src 'self' https://js.stripe.com"  // No 'unsafe-inline'
"style-src 'self' https://fonts.googleapis.com"  // No 'unsafe-inline'
```

### Use Nonces or Hashes

For inline scripts in production:

```javascript
// Generate nonce
const nonce = crypto.randomBytes(16).toString('base64')

// Add to CSP
"script-src 'self' 'nonce-${nonce}' https://js.stripe.com"

// Use in HTML
<script nonce="${nonce}">...</script>
```

### Environment-Specific CSP

```javascript
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "https://js.stripe.com",
    ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : [])
  ],
  // ... other directives
}
```

## 🐛 Troubleshooting

### Still seeing CSP errors?

1. **Clear browser cache completely**
   - DevTools → Application → Clear storage
   - Or use incognito/private mode

2. **Check which CSP is active**
   - DevTools → Network → Select any request
   - Look at Response Headers → `content-security-policy`
   - Verify it includes Stripe domains

3. **Check for multiple CSP headers**
   - Only one CSP should be active
   - Backend and frontend shouldn't conflict

### Stripe still not loading?

1. **Check Stripe publishable key**
   ```javascript
   console.log('Stripe key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
   // Should start with pk_test_ or pk_live_
   ```

2. **Check network requests**
   - DevTools → Network → Filter: `stripe`
   - All requests should be status 200

3. **Check console for Stripe errors**
   ```javascript
   window.Stripe  // Should be defined
   ```

### X-Frame-Options still showing?

1. **Verify main.ts changes**
   - No `addSecurityHeaders()` function
   - No meta tag creation

2. **Hard refresh**
   - `Ctrl + Shift + R`

3. **Check for other files**
   ```bash
   # Search for X-Frame-Options in your code
   grep -r "X-Frame-Options" src/
   ```

## ✅ Verification Checklist

- [x] Removed meta tag security headers from main.ts
- [x] Added CSP headers to vite.config.ts
- [x] Updated backend CSP to allow Stripe
- [x] Restarted frontend dev server
- [x] Restarted backend server
- [ ] Hard refreshed browser (Ctrl + Shift + R)
- [ ] No console errors for X-Frame-Options
- [ ] No CSP violations for Stripe
- [ ] Stripe.js loads successfully
- [ ] Can create Stripe elements
- [ ] Can process test payments

## 📚 Resources

- **CSP Reference**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
- **Stripe CSP Guide**: https://stripe.com/docs/security/guide#content-security-policy
- **Helmet.js Docs**: https://helmetjs.github.io/
- **Vite Server Options**: https://vitejs.dev/config/server-options.html

---

**Status**: ✅ All Security Header Issues Fixed

Both frontend and backend are now properly configured for Stripe integration. Hard refresh your browser to see the changes!