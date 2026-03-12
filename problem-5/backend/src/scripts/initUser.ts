import { connectMongoDB } from "../configs/mongoose.config";
import User from "../models/user.model";
import { hashPassword } from "../utils/password";

const main = async () => {
  try {
    await connectMongoDB();

    await User.insertMany([
      {
        username: "99techteam",
        password: await hashPassword("Asdfgh1@3"),
        role: "admin",
      },
      {
        username: "developer",
        password: await hashPassword("Asdfgh1@3"),
        role: "user",
      },
    ]);

    console.log("created users");
  } catch (err) {
    console.error(err);
  }
};

main();
