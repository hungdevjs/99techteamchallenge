import { Request, Response } from "express";

import * as service from "../services/auth.service";
import controllerCatcher from "../utils/controllerCatcher";

export const login = controllerCatcher(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const data = await service.login(username, password);
  return res.status(200).send(data);
});
