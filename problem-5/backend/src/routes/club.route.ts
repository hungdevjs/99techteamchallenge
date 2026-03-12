import { Router } from 'express';
import * as controller from '../controllers/club.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.get('/', controller.get);
router.get('/:id', controller.getById);

// Protected routes
router.use(authMiddleware);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
