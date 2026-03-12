import { Request, Response, NextFunction } from "express";

const controllerCatcher = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default controllerCatcher;
