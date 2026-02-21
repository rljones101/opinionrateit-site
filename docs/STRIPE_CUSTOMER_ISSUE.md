# Stripe Customer ID Missing - Fix Guide

## Issues Found

### 1. CORS Error (Secondary Issue)
The CORS error is a symptom, not the root cause. It appears because the 400 error response doesn't include CORS headers.

### 2. 400 Bad Request (Primary Issue)
**Error**: `Must provide customer or customer_account`

**Cause**: The `customer` field is empty or undefined when calling `/api/v1/stripe/create-intent`

### 3. Frontend Error
**Error**: `Cannot read properties of undefined (reading 'secret')`

**Cause**: The API returns an error, so `res.data.secret` doesn't exist

## Root Cause

The billing form is trying to create a payment intent without a Stripe customer ID. The flow should be:

1. ✅ User fills out account details
2. ❌ **Create Stripe customer** (MISSING!)
3. ❌ Store customer ID in signup store
4. ❌ User proceeds to billing step
5. ❌ Billing form uses customer ID to create payment intent

## Solution

### Option 1: Create Customer in Account Step

Update the account step to create a Stripe customer:

```typescript
// In AccountStep or signupStore
import { createCustomer } from '@/services/stripeService'

const handleAccountSubmit = async (accountData) => {
  try {
    // Create Stripe customer
    const customerResponse = await createCustomer({
      email: accountData.email,
      name: accountData.name
    })
    
    // Store customer ID
    signupStore.setBillingFormData({
      id: customerResponse.data.customer.id,  // cus_...
      name: accountData.name,
      email: accountData.email
    })
    
    // Proceed to next step
    nextStep()
  } catch (error) {
    console.error('Failed to create customer:', error)
  }
}
```

### Option 2: Create Customer in Billing Step

Create the customer when the billing form mounts:

```typescript
// In useBillingForm.ts
onMounted(async () => {
  // Create customer if not exists
  if (!customer.value) {
    try {
      const customerResponse = await createCustomer({
        email: email.value,
        name: fullName.value
      })
      
      customer.value = customerResponse.data.customer.id
      
      // Update store
      signupStore.setBillingFormData({
        ...signupStore.billingFormData,
        id: customerResponse.data.customer.id
      })
    } catch (error) {
      console.error('Failed to create customer:', error)
    }
  }
  
  // Mount Stripe element
  mountCardElement('#stripe-element-mount-point')
})
```

### Option 3: Lazy Customer Creation

Create customer only when submitting payment:

```typescript
const handleSubmit = billingForm.handleSubmit(async () => {
  try {
    // Create customer if not exists
    if (!customer.value) {
      const customerResponse = await createCustomer({
        email: email.value,
        name: fullName.value
      })
      customer.value = customerResponse.data.customer.id
    }
    
    // Now create payment intent
    const secret = await setupPaymentIntent()
    
    // ... rest of payment flow
  } catch (error) {
    console.error('Payment error:', error)
  }
})
```

## Recommended Approach

**Option 1** is best because:
- ✅ Customer is created early in the flow
- ✅ Customer ID is available for all subsequent steps
- ✅ Better error handling (fail early)
- ✅ Can associate customer with user account

## Implementation Steps

1. **Update Account Step**:
   - Call `createCustomer` after account validation
   - Store customer ID in signup store

2. **Update Signup Store**:
   ```typescript
   setBillingFormData(data: {
     id: string,        // Stripe customer ID
     name: string,
     email: string
   }) {
     this.billingFormData = data
   }
   ```

3. **Verify in Billing Step**:
   ```typescript
   onMounted(() => {
     if (!customer.value) {
       console.error('Customer ID missing!')
       // Redirect back to account step or show error
     }
   })
   ```

## Testing

### 1. Check Customer Creation

```javascript
// In browser console after account step
console.log('Customer ID:', signupStore.billingFormData.id)
// Should show: cus_...
```

### 2. Check API Call

```javascript
// In useBillingForm before creating payment intent
console.log('Payment intent data:', {
  customer: customer.value,
  lookupKey: signupStore.selectedPlan.lookupKey
})
// customer should be: cus_...
// lookupKey should be: your-plan-key
```

### 3. Verify in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/customers
2. Should see customer created with email
3. Note the customer ID (cus_...)

## Error Messages Added

### Backend
- ✅ "Customer ID is required. Please create a customer first."
- ✅ "Price lookup key is required."
- ✅ "Price not found for lookup key: {key}"
- ✅ Better error logging

### Frontend
- ✅ "Customer ID is missing. Please complete the account step first."
- ✅ "Plan lookup key is missing. Please select a plan."
- ✅ "Invalid response from payment intent creation"

## Debugging

### Check Customer Value

```typescript
// Add to useBillingForm
watch(() => customer.value, (val) => {
  console.log('Customer ID changed:', val)
})
```

### Check Signup Store

```typescript
// In browser console
console.log('Signup store:', signupStore.$state)
```

### Check Backend Logs

Look for:
```
Creating payment intent for customer: cus_... with lookup key: ...
```

If you see:
```
Creating payment intent for customer: undefined with lookup key: ...
```

Then the customer ID isn't being passed.

## Next Steps

1. ✅ Backend error handling improved
2. ✅ Frontend error handling improved
3. ⏭️ Implement customer creation in account step
4. ⏭️ Test full signup flow
5. ⏭️ Verify customer appears in Stripe dashboard

---

**Status**: ⚠️ Customer creation needed

**Action Required**: Implement customer creation before billing step