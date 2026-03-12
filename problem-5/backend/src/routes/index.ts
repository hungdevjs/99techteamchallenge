import { Router } from 'express';

import authRouter from './auth.route';
import clubRouter from './club.route';

const router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/clubs', clubRouter);

export default router;
