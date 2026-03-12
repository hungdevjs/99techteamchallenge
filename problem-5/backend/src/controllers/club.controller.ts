import { Request, Response } from 'express';

import * as service from '../services/club.service';
import controllerCatcher from '../utils/controllerCatcher';

export const get = controllerCatcher(async (req: Request, res: Response) => {
  const { page, limit, search, countries } = req.query;
  const data = await service.get({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
    search: search as string,
    countries: countries as string[],
  });

  return res.status(200).send(data);
});

export const getById = controllerCatcher(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await service.getById(id as string);
  return res.status(200).send(data);
});

export const create = controllerCatcher(async (req: Request, res: Response) => {
  const data = await service.create(req.body);
  return res.status(201).send(data);
});

export const update = controllerCatcher(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await service.update(id as string, req.body);
  return res.status(200).send(data);
});

export const remove = controllerCatcher(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await service.remove(id as string);
  return res.status(200).send(data);
});
