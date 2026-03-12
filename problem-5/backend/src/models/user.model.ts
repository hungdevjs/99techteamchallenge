import { Schema, Document, Model, model } from "mongoose";

interface IUserDoc extends Document {
  username: string;
  password: string;
  role: "admin" | "user";
}

interface IUserModel extends Model<IUserDoc> {}

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true, collection: "users" },
);

const User = model<IUserDoc, IUserModel>("User", userSchema);

export default User;
