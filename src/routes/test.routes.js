import { Router } from 'express';
import { addTest, getTestsByCentre } from '../controllers/test.controller.js';
import { createTestValidator } from '../validators/test.validator.js';

const router = Router();

router.post('/', createTestValidator, addTest);
router.get('/', getTestsByCentre);

export default router;