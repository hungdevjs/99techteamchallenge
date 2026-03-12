import { Request, Response, NextFunction } from 'express';

const json = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('content-type', 'application/json');
  next();
};

export default json;
