import { Schema, Document, Model, Types, model } from 'mongoose';

interface IPlayerDoc extends Document {
  name: string;
  club: Types.ObjectId;
  nationality: Types.ObjectId;
  yob: number;
}

interface IPlayerModel extends Model<IPlayerDoc> {}

const playerSchema = new Schema<IPlayerDoc, IPlayerModel>(
  {
    name: {
      type: String,
      required: true,
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: false,
    },
    nationality: {
      type: Schema.Types.ObjectId,
      ref: 'Nation',
      required: true,
    },
    yob: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: 'players' },
);

const Player = model<IPlayerDoc, IPlayerModel>('Player', playerSchema);

export default Player;
