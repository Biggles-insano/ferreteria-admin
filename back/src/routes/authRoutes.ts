import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema, registerSchema } from '../schemas';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);

export default router;
