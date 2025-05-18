const loadEnvConfig = require('../utils/loadEnvConfig.js')
loadEnvConfig(process.env.NODE_ENV)
const stripe = require('stripe')(process.env.STRIPE_API_KEY)
const catchAsync = require('../utils/catchAsync')

exports.createCustomer = catchAsync(async (req, res) => {
  const { email, name } = req.body
  const customer = await stripe.customers.create({
    email,
    name
  })
  res.status(200).json({
    status: 'success',
    data: {
      data: customer
    }
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

const createSubscription = async(customer, price) => {
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
  const { lookupKey, customer } = req.body
  const price = await lookupPrice(lookupKey)
  const paymentIntent = await createPaymentIntent(price)
  const secret = paymentIntent.client_secret
  await createSubscription(customer, price)

  res.status(200).json({
    status: 'success',
    data: {
      data: {
        secret
      }
    }
  })
})

exports.stripeWebHook = (req, res) => {
  let event = req.body
  // Replace this endpoint secret with your endpoint's unique secret
  // If you are testing with the CLI, find the secret by running 'stripe listen'
  // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
  // at https://dashboard.stripe.com/webhooks
  const endpointSecret = process.env.STRIPE_END_POINT_SECRET
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
  let subscription
  let status
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object
      status = paymentIntentSucceeded.status
      console.log(`Payment Intent status is ${status}.`)
      // Then define and call a function to handle the event payment_intent.succeeded
      break
    case 'customer.subscription.trial_will_end':
      subscription = event.data.object
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription trial ending.
      // handleSubscriptionTrialEnding(subscription);
      break
    case 'customer.subscription.deleted':
      subscription = event.data.object
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      break
    case 'customer.subscription.created':
      subscription = event.data.object
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Then define and call a method to handle the subscription created.
      // handleSubscriptionCreated(subscription);
      break
    case 'customer.subscription.updated':
      subscription = event.data.object
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
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
