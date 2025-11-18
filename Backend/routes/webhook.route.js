// routes/webhook.js
import express from 'express';
import stripe from '../config/strip.js';
import Order from '../models/order.model.js';

const router = express.Router();

// Raw body parser only for webhook
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET // Set this in .env
      );
    } catch (err) {
      console.error('Webhook error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Only handle successful checkout sessions
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      try {
        const userId = session.metadata.userId;
        const address = JSON.parse(session.metadata.address);
        const products = JSON.parse(session.metadata.products);
        const totalPrice = parseFloat(session.metadata.totalPrice);
        const paymentMethod = session.metadata.paymentMethod;

        const order = new Order({
          user: userId,
          address,
          products,
          totalPrice,
          paymentMethod,
        });

        await order.save();
        console.log('✅ Order saved via webhook');
      } catch (error) {
        console.error('Failed to save order via webhook:', error.message);
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;
