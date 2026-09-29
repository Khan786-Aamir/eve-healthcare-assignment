import { Router } from 'express';
import { initiatePayment, paymentWebhook } from '../controllers/payment.controller.js';
import { createPaymentValidator, webhookValidator } from '../validators/payment.validator.js';

const router = Router();

router.post('/', createPaymentValidator, initiatePayment);
router.post('/webhook', webhookValidator, paymentWebhook);

export default router;