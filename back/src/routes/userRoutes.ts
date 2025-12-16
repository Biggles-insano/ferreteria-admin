import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

// All routes require authentication and Admin role
router.use(authenticateToken, authorizeRole(['Admin']));

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
