import { Schema, Document, Model, Types, model } from "mongoose";

interface ICoachDoc extends Document {
  name: string;
  club?: Types.ObjectId;
  nationality: Types.ObjectId;
  yob: number;
}

interface ICoachModel extends Model<ICoachDoc> {}

const coachSchema = new Schema<ICoachDoc, ICoachModel>(
  {
    name: {
      type: String,
      required: true,
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: false,
    },
    nationality: {
      type: Schema.Types.ObjectId,
      ref: "Nation",
      required: true,
    },
    yob: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: "coaches" },
);

const Coach = model<ICoachDoc, ICoachModel>("Coach", coachSchema);

export default Coach;
