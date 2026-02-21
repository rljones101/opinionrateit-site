// Stripe configuration and styling
// Note: Stripe Elements don't support oklch() colors from Tailwind v4
// We need to use hex/rgb colors instead

export const stripeElementsStyle = {
  base: {
    color: '#1f2937', // gray-800 in hex
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#9ca3af' // gray-400 in hex
    }
  },
  invalid: {
    color: '#ef4444', // red-500 in hex
    iconColor: '#ef4444'
  },
  complete: {
    color: '#10b981', // green-500 in hex
    iconColor: '#10b981'
  }
}

export const stripeElementsOptions = {
  style: stripeElementsStyle,
  hidePostalCode: false
}

// Convert Tailwind oklch colors to hex for Stripe compatibility
export const tailwindToHex = {
  // Primary colors
  'brand-50': '#eff6ff',
  'brand-100': '#dbeafe',
  'brand-200': '#bfdbfe',
  'brand-300': '#93c5fd',
  'brand-400': '#60a5fa',
  'brand-500': '#3b82f6',
  'brand-600': '#2563eb',
  'brand-700': '#1d4ed8',
  'brand-800': '#1e40af',
  'brand-900': '#1e3a8a',
  
  // Gray colors
  'gray-50': '#f9fafb',
  'gray-100': '#f3f4f6',
  'gray-200': '#e5e7eb',
  'gray-300': '#d1d5db',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827',
  
  // Status colors
  'red-500': '#ef4444',
  'green-500': '#10b981',
  'yellow-500': '#f59e0b',
  'blue-500': '#3b82f6'
}

// Helper function to get hex color
export const getHexColor = (tailwindColor: string): string => {
  return tailwindToHex[tailwindColor as keyof typeof tailwindToHex] || tailwindColor
}

// Stripe appearance configuration for Payment Element
export const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#3b82f6', // brand-500
    colorBackground: '#ffffff',
    colorText: '#1f2937', // gray-800
    colorDanger: '#ef4444', // red-500
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    spacingUnit: '4px',
    borderRadius: '6px'
  },
  rules: {
    '.Input': {
      border: '1px solid #d1d5db', // gray-300
      boxShadow: 'none'
    },
    '.Input:focus': {
      border: '1px solid #3b82f6', // brand-500
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    '.Label': {
      color: '#374151', // gray-700
      fontWeight: '500'
    }
  }
}

export default {
  stripeElementsStyle,
  stripeElementsOptions,
  stripeAppearance,
  tailwindToHex,
  getHexColor
}
