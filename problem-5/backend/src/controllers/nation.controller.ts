import { Request, Response } from 'express';
import Nation from '../models/nation.model';
import controllerCatcher from '../utils/controllerCatcher';

export const getAll = controllerCatcher(async (req: Request, res: Response) => {
  const nations = await Nation.find().sort({ name: 1 });
  return res.status(200).send(nations);
});
