import { Router } from 'express';
import { addCentre, getAllCentres } from '../controllers/centre.controller.js';
import { createCentreValidator } from '../validators/centre.validator.js';

const router = Router();

router.post('/', createCentreValidator, addCentre);
router.get('/', getAllCentres);

export default router;