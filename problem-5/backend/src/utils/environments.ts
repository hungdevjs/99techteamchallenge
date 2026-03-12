import dotenv from "dotenv";

dotenv.config();

interface IEnvironments {
  PORT: string | undefined;

  MONGO_URI: string | undefined;

  JWT_SECRET_KEY: string | undefined;
  JWT_LIFE_TIME: string | undefined;
}

const environments: IEnvironments = {
  PORT: process.env.PORT,

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_LIFE_TIME: process.env.JWT_LIFE_TIME,
};

export default environments;
