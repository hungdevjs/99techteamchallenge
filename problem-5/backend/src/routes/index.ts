import { Router } from 'express';

import authRouter from './auth.route';
import clubRouter from './club.route';
import nationRouter from './nation.route';
import coachRouter from './coach.route';

const router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/clubs', clubRouter);
router.use('/v1/nations', nationRouter);
router.use('/v1/coaches', coachRouter);

export default router;
