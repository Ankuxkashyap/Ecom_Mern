import express from 'express';
import { addToCart,deleteCartItem,updateCartItem,removeFromCart,getCart,  } from '../controllers/cart.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.get('/',authMiddleware,getCart);
router.post('/',authMiddleware,addToCart);
router.put('/:productId',authMiddleware,updateCartItem);
router.put('/:id',authMiddleware,removeFromCart);
router.delete('/:id',authMiddleware,deleteCartItem);

export default router;
