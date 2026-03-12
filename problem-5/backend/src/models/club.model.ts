import { Schema, Document, Model, Types, model } from "mongoose";

interface IClubDoc extends Document {
  name: string;
  nationality: Types.ObjectId;
  logoURL: string;
  headCoach?: Types.ObjectId;
  numberOfPlayers: number;
}

interface IClubModel extends Model<IClubDoc> {}

const clubSchema = new Schema<IClubDoc, IClubModel>(
  {
    name: {
      type: String,
      required: true,
    },
    nationality: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Nation",
    },
    logoURL: {
      type: String,
      required: true,
    },
    headCoach: {
      type: Schema.Types.ObjectId,
      ref: "Coach",
      required: false,
    },
    numberOfPlayers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: "clubs" },
);

const Club = model<IClubDoc, IClubModel>("Club", clubSchema);

export default Club;
