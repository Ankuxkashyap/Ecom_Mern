import stripe from '../config/strip.js';
import Order from '../models/order.model.js';

// Create Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, address, totalPrice, paymentMethod } = req.body;
    const userId = req.user._id; // Ensure auth middleware sets req.user

    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'No products provided' });
    }

    const line_items = products.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Stripe accepts integer paise
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
      metadata: {
        userId: userId.toString(),
        address: JSON.stringify(address), // must be string
        products: JSON.stringify(products),
        totalPrice: totalPrice.toString(),
        paymentMethod,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};
