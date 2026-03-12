import { Request, Response } from 'express';
import Coach from '../models/coach.model';
import controllerCatcher from '../utils/controllerCatcher';

export const getAll = controllerCatcher(async (req: Request, res: Response) => {
  const coaches = await Coach.find().sort({ name: 1 });
  return res.status(200).send(coaches);
});
