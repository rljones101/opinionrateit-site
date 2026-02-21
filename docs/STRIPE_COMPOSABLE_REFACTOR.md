# Stripe Controller → Composable Refactor

## Overview

Refactored `src/controllers/stripeController.ts` into a proper Vue 3 composable `src/composables/useStripe.ts` for better code organization and reusability.

## Changes Made

### 1. Created New Composable

**File**: `src/composables/useStripe.ts`

**Features**:
- ✅ Reactive state management with Vue refs
- ✅ Proper TypeScript types
- ✅ Lifecycle management (onMounted)
- ✅ Error handling and reporting
- ✅ Console logging for debugging
- ✅ Cleanup on unmount

**API**:
```typescript
const {
  // State
  stripe,           // Stripe instance
  elements,         // Stripe Elements instance
  cardElement,      // Card element reference
  isLoaded,         // Initialization status
  error,            // Error message (if any)

  // Methods
  initializeStripe,      // Initialize Stripe with key
  createCardElement,     // Create card element
  getCardElement,        // Get existing card element
  mountCardElement,      // Mount element to DOM
  createPaymentMethod,   // Create payment method
  confirmCardPayment,    // Confirm payment
  destroyCardElement,    // Cleanup element
  clearError            // Clear error state
} = useStripe()
```

### 2. Updated useBillingForm

**File**: `src/composables/useBillingForm.ts`

**Changes**:
- ✅ Import `useStripe` instead of controller functions
- ✅ Use composable methods directly
- ✅ Added `onUnmounted` for cleanup
- ✅ Expose `stripeError` to component
- ✅ Simplified payment flow

**Before**:
```typescript
import {
  confirmCardPayment,
  createCardElement,
  createPaymentMethod,
  getCardElement
} from '@/controllers/stripeController'

const cardElement = getCardElement()
const paymentMethodReq = await createPaymentMethod(cardElement, billingDetails)
```

**After**:
```typescript
import { useStripe } from '@/composables/useStripe'

const { mountCardElement, createPaymentMethod, confirmCardPayment } = useStripe()

const paymentMethodReq = await createPaymentMethod(billingDetails)
```

### 3. Updated BillingForm Component

**File**: `src/components/forms/BillingForm.vue`

**Changes**:
- ✅ Display Stripe errors to users
- ✅ Conditional rendering of error vs hint

**Before**:
```vue
<p class="mt-1 text-xs text-gray-500">
  Test card: 4242 4242 4242 4242
</p>
```

**After**:
```vue
<p v-if="stripeError" class="mt-1 text-sm text-red-600">
  {{ stripeError }}
</p>
<p v-else class="mt-1 text-xs text-gray-500">
  Test card: 4242 4242 4242 4242 | Any future date | Any 3 digits
</p>
```

## Benefits

### 1. Better Code Organization
- ✅ Follows Vue 3 composition API patterns
- ✅ Separates concerns properly
- ✅ Easier to test and maintain

### 2. Improved Type Safety
- ✅ Proper TypeScript interfaces
- ✅ Type-safe method signatures
- ✅ Better IDE autocomplete

### 3. Enhanced Error Handling
- ✅ Centralized error state
- ✅ User-friendly error messages
- ✅ Console logging for debugging

### 4. Lifecycle Management
- ✅ Automatic initialization on mount
- ✅ Proper cleanup on unmount
- ✅ Prevents memory leaks

### 5. Reusability
- ✅ Can be used in any component
- ✅ Consistent API across app
- ✅ Easy to extend

## Usage Examples

### Basic Usage

```vue
<script setup lang="ts">
import { useStripe } from '@/composables/useStripe'
import { onMounted } from 'vue'

const { mountCardElement, createPaymentMethod, error } = useStripe()

onMounted(() => {
  mountCardElement('#card-element')
})

const handlePayment = async () => {
  try {
    const result = await createPaymentMethod({
      name: 'John Doe',
      email: 'john@example.com',
      address: {
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001'
      }
    })
    console.log('Payment method created:', result)
  } catch (err) {
    console.error('Payment failed:', err)
  }
}
</script>

<template>
  <div>
    <div id="card-element"></div>
    <p v-if="error" class="text-red-600">{{ error }}</p>
    <button @click="handlePayment">Pay</button>
  </div>
</template>
```

### Advanced Usage with Custom Styling

```typescript
import { useStripe } from '@/composables/useStripe'

const stripe = useStripe()

// Wait for Stripe to load
watch(() => stripe.isLoaded.value, (loaded) => {
  if (loaded) {
    // Custom element creation
    const element = stripe.createCardElement()
    
    // Listen to events
    element.on('change', (event) => {
      if (event.error) {
        console.error(event.error.message)
      }
    })
    
    // Mount to DOM
    stripe.mountCardElement('#custom-card-element')
  }
})
```

### Multiple Components

```typescript
// Component A
const stripeA = useStripe()
stripeA.mountCardElement('#card-a')

// Component B (reuses same Stripe instance)
const stripeB = useStripe()
// Elements are shared, no need to reinitialize
```

## Migration Guide

### For Existing Code

If you have code using the old controller:

**Old**:
```typescript
import { createCardElement, getCardElement } from '@/controllers/stripeController'

const element = createCardElement()
element.mount('#card-element')
```

**New**:
```typescript
import { useStripe } from '@/composables/useStripe'

const { mountCardElement } = useStripe()
mountCardElement('#card-element')
```

### Breaking Changes

1. **Import Path Changed**:
   - Old: `@/controllers/stripeController`
   - New: `@/composables/useStripe`

2. **API Changed**:
   - Old: `createPaymentMethod(cardElement, billingDetails)`
   - New: `createPaymentMethod(billingDetails)` (element tracked internally)

3. **Initialization**:
   - Old: Automatic on import
   - New: Automatic on `onMounted` (composable lifecycle)

## Testing

### Unit Tests

```typescript
import { describe, it, expect, vi } from 'vitest'
import { useStripe } from '@/composables/useStripe'

describe('useStripe', () => {
  it('initializes Stripe on mount', () => {
    const { isLoaded } = useStripe()
    expect(isLoaded.value).toBe(true)
  })

  it('handles errors gracefully', async () => {
    const { createPaymentMethod, error } = useStripe()
    
    await createPaymentMethod({} as any) // Invalid data
    
    expect(error.value).toBeTruthy()
  })
})
```

### Integration Tests

```typescript
import { mount } from '@vue/test-utils'
import BillingForm from '@/components/forms/BillingForm.vue'

describe('BillingForm', () => {
  it('mounts Stripe element', async () => {
    const wrapper = mount(BillingForm)
    await wrapper.vm.$nextTick()
    
    const element = document.getElementById('stripe-element-mount-point')
    expect(element).toBeTruthy()
  })
})
```

## Cleanup

### Files to Remove

Once migration is complete:
- ❌ `src/controllers/stripeController.ts` (can be deleted)
- ❌ `src/controllers/signupViewController.ts` (if only used for Stripe)

### Files to Keep

- ✅ `src/composables/useStripe.ts` (new composable)
- ✅ `src/config/stripe.ts` (configuration)
- ✅ `src/composables/useBillingForm.ts` (updated)

## Next Steps

1. ✅ Test the refactored code
2. ✅ Verify Stripe element renders
3. ✅ Test payment flow end-to-end
4. ⏭️ Remove old controller file
5. ⏭️ Update other components using Stripe
6. ⏭️ Add unit tests for composable

---

**Status**: ✅ Refactoring Complete

The Stripe functionality is now properly organized as a Vue 3 composable with better error handling and lifecycle management!