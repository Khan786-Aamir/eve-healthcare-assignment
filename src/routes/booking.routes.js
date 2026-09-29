import { Router } from 'express';
import { bookTest, getMyBookings, removeBooking } from '../controllers/booking.controller.js';
import { createBookingValidator } from '../validators/booking.validator.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJWT);
router.post('/', createBookingValidator, bookTest);
router.get('/', getMyBookings);
router.delete('/:id', removeBooking);

export default router;