import express from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post('/', authMiddleware, createCheckoutSession);

router.get('/', authMiddleware, async (req, res) => {
  res.status(200).json({
    message: "Payment Intent Created",
  });
});


export default router;
