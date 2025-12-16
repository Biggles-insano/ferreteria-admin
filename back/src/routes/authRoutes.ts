import { Router } from 'express';
import { login } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema, registerSchema } from '../schemas';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/login', authLimiter, validateRequest(loginSchema), login);

export default router;
