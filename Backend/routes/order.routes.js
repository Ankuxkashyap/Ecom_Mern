import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrders, // Admin route
} from '../controllers/order.controller.js';

import { authMiddleware} from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Authenticated user routes
router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);

// Admin-only routes
router.get('/', authMiddleware, isAdmin, getAllOrders);
router.put('/:id', authMiddleware, isAdmin, updateOrderStatus);
router.delete('/:id', authMiddleware, isAdmin, deleteOrder);

export default router;
