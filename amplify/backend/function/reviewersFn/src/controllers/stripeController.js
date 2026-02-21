const loadEnvConfig = require('../utils/loadEnvConfig.js')
loadEnvConfig(process.env.NODE_ENV)

// Initialize Stripe only if API key is provided and not a placeholder
let stripe = null
if (process.env.STRIPE_SECRET_KEY && 
    process.env.STRIPE_SECRET_KEY !== 'your-stripe-secret-key' && 
    process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
}
const catchAsync = require('../utils/catchAsync')

exports.createCustomer = catchAsync(async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      status: 'error',
      message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.'
    })
  }
  
  const { email, name } = req.body
  const customer = await stripe.customers.create({
    email,
    name
  })
  res.status(200).json({
    status: 'success',
    data: { customer }
  })
})

const lookupPrice = async (lookupKey) => {
  const prices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    expand: ['data.product']
  })

  return prices.data[0]
}

const createPaymentIntent = async (price) => {
  return await stripe.paymentIntents.create({
    amount: price.unit_amount,
    currency: price.currency,
    automatic_payment_methods: { enabled: true }
  })
}

const createSubscription = async (customer, price) => {
  return await stripe.subscriptions.create({
    customer,
    items: [
      {
        price: price.id
      }
    ],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice']
  })
}

exports.createIntent = catchAsync(async (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      status: 'error',
      message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.'
    })
  }
  
  const { lookupKey, customer } = req.body
  
  // Validate required fields
  if (!customer) {
    return res.status(400).json({
      status: 'error',
      message: 'Customer ID is required. Please create a customer first.'
    })
  }
  
  if (!lookupKey) {
    return res.status(400).json({
      status: 'error',
      message: 'Price lookup key is required.'
    })
  }
  
  // Validate lookup key is one of the recognized tiers
  const validLookupKeys = ['basic-tier', 'creator-tier']
  if (!validLookupKeys.includes(lookupKey)) {
    console.warn(`Unrecognized lookup key attempted: ${lookupKey}`)
    return res.status(400).json({
      status: 'error',
      message: `Invalid lookup key. Expected one of: ${validLookupKeys.join(', ')}`
    })
  }
  
  // Determine tier name for logging
  const tierName = lookupKey === 'basic-tier' ? 'Basic' : 'Creator'
  console.log(`Creating ${tierName} tier payment intent for customer:`, customer, 'with lookup key:', lookupKey)
  
  try {
    const price = await lookupPrice(lookupKey)
    
    if (!price) {
      console.error(`Price not found for ${tierName} tier (lookup key: ${lookupKey})`)
      return res.status(404).json({
        status: 'error',
        message: `Price not found for lookup key: ${lookupKey}. Please ensure the ${tierName} tier is configured in Stripe.`
      })
    }
    
    console.log(`Found ${tierName} tier price:`, {
      priceId: price.id,
      amount: price.unit_amount,
      currency: price.currency,
      productName: price.product?.name
    })
    
    const paymentIntent = await createPaymentIntent(price)
    const secret = paymentIntent.client_secret
    const subscription = await createSubscription(customer, price)
    
    console.log(`Successfully created ${tierName} tier subscription:`, {
      subscriptionId: subscription.id,
      status: subscription.status,
      customerId: customer
    })

    res.status(200).json({
      status: 'success',
      data: { secret }
    })
  } catch (error) {
    console.error(`Error creating ${tierName} tier payment intent:`, error)
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create payment intent'
    })
  }
})

exports.stripeWebHook = (req, res) => {
  if (!stripe) {
    return res.status(503).json({
      status: 'error',
      message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.'
    })
  }
  
  let event = req.body
  // Replace this endpoint secret with your endpoint's unique secret
  // If you are testing with the CLI, find the secret by running 'stripe listen'
  // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
  // at https://dashboard.stripe.com/webhooks
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature']
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret)
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message)
      return res.sendStatus(400)
    }
  }
  
  // Helper function to extract tier information from subscription
  const getTierInfo = (subscription) => {
    if (!subscription || !subscription.items || !subscription.items.data || subscription.items.data.length === 0) {
      return { tier: 'unknown', lookupKey: null }
    }
    
    const price = subscription.items.data[0].price
    const lookupKey = price?.lookup_key || null
    
    let tier = 'unknown'
    if (lookupKey === 'basic-tier') {
      tier = 'Basic'
    } else if (lookupKey === 'creator-tier') {
      tier = 'Creator'
    }
    
    return { tier, lookupKey }
  }
  
  let subscription
  let status
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object
      status = paymentIntentSucceeded.status
      console.log(`Payment Intent succeeded:`, {
        paymentIntentId: paymentIntentSucceeded.id,
        status,
        amount: paymentIntentSucceeded.amount,
        currency: paymentIntentSucceeded.currency,
        customerId: paymentIntentSucceeded.customer
      })
      // Then define and call a function to handle the event payment_intent.succeeded
      break
    case 'customer.subscription.trial_will_end':
      subscription = event.data.object
      status = subscription.status
      const trialTierInfo = getTierInfo(subscription)
      console.log(`Subscription trial will end:`, {
        subscriptionId: subscription.id,
        status,
        tier: trialTierInfo.tier,
        lookupKey: trialTierInfo.lookupKey,
        customerId: subscription.customer
      })
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break
    case 'customer.subscription.deleted':
      subscription = event.data.object
      status = subscription.status
      const deletedTierInfo = getTierInfo(subscription)
      console.log(`Subscription deleted:`, {
        subscriptionId: subscription.id,
        status,
        tier: deletedTierInfo.tier,
        lookupKey: deletedTierInfo.lookupKey,
        customerId: subscription.customer
      })
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break
    case 'customer.subscription.created':
      subscription = event.data.object
      status = subscription.status
      const createdTierInfo = getTierInfo(subscription)
      console.log(`${createdTierInfo.tier} tier subscription created:`, {
        subscriptionId: subscription.id,
        status,
        tier: createdTierInfo.tier,
        lookupKey: createdTierInfo.lookupKey,
        customerId: subscription.customer,
        currentPeriodEnd: subscription.current_period_end
      })
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break
    case 'customer.subscription.updated':
      subscription = event.data.object
      status = subscription.status
      const updatedTierInfo = getTierInfo(subscription)
      console.log(`${updatedTierInfo.tier} tier subscription updated:`, {
        subscriptionId: subscription.id,
        status,
        tier: updatedTierInfo.tier,
        lookupKey: updatedTierInfo.lookupKey,
        customerId: subscription.customer,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      })
      // Then define and call a method to handle the subscription update.
      // handleSubscriptionUpdated(subscription);
      break
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`)
  }
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true })
}
