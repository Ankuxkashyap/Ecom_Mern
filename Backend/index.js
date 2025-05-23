import express from 'express';                  
import connectDb from './config/db.js'; 
import UserRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import cookieParser from 'cookie-parser';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDb();

app.get('/', (req, res) => {
    res.send('All Good 💀 !');
});

app.use('/user', UserRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/payment', paymentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
