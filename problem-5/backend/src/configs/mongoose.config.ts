import mongoose, { MongooseError } from "mongoose";

import environments from "../utils/environments";

const { MONGO_URI } = environments;

mongoose.connection.on("error", (err: MongooseError) => console.error(err));
mongoose.connection.on("connected", () => console.log("connected to mongodb"));
mongoose.connection.on("disconnected", () =>
  console.log("disconnected from mongodb"),
);
mongoose.connection.on("reconnected", () =>
  console.log("reconnected to mongodb"),
);

export const connectMongoDB = async () => {
  await mongoose.connect(MONGO_URI as string);
};
