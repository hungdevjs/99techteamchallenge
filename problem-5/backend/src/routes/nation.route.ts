import { Router } from 'express';
import * as controller from '../controllers/nation.controller';

const router = Router();

router.get('/', controller.getAll);

export default router;
