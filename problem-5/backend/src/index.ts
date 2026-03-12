import express, { Request, Response } from 'express';
import cors from 'cors';

import { connectMongoDB } from './configs/mongoose.config';
import json from './middlewares/json.middleware';
import errorHandler from './middlewares/errorHandler.middleware';
import routes from './routes';
import environments from './utils/environments';

const { PORT } = environments;

const main = async () => {
  await connectMongoDB();

  const app = express();
  app.use(cors({ origin: '*' }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (_req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.use(json);
  app.use('/api', routes);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
};

main();
