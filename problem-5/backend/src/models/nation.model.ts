import { Schema, Document, Model, model } from "mongoose";

interface INationDoc extends Document {
  name: string;
  flagURL: string;
}

interface INationModel extends Model<INationDoc> {}

const nationSchema = new Schema<INationDoc, INationModel>(
  {
    name: {
      type: String,
      required: true,
    },
    flagURL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "nations" },
);

const Nation = model<INationDoc, INationModel>("Nation", nationSchema);

export default Nation;
