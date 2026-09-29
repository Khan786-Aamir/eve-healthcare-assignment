import { PAYMENT_STATUS } from '../constants/index.js';

export const simulatePayment = () => {
  return Math.random() > 0.2 ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED;
};