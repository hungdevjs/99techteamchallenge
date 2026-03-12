import { Types } from 'mongoose';

import { IClub } from '../interfaces/club.interface';
import Club from '../models/club.model';
import Player from '../models/player.model';
import Nation from '../models/nation.model';
import Coach from '../models/coach.model';

export const get = async ({
  page,
  limit,
  search,
  countries,
}: {
  page: number;
  limit: number;
  search: string;
  countries: string[];
}) => {
  const query = {
    ...(search && { name: { $regex: search, $options: 'i' } }),
    ...(countries?.length && { nationality: { $in: countries } }),
  };

  const items = await Club.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('nationality')
    .populate('headCoach')
    .lean();
  const total = await Club.countDocuments(query);

  return {
    items,
    total,
  };
};

export const getById = async (id: string) => {
  const club = await Club.findById(id)
    .populate('nationality')
    .populate('headCoach')
    .lean();
  if (!club) throw new Error('Club not found');

  const players = await Player.find({ club: id })
    .populate('nationality')
    .lean();

  return { ...club, players };
};

export const create = async (data: IClub) => {
  const { name, nationality, logoURL, headCoach } = data;

  if (!name?.trim() || !nationality?.trim() || !logoURL?.trim())
    throw new Error('Missing required fields');
  const nation = await Nation.findById(nationality).lean();
  if (!nation) throw new Error('Nation not found');

  let coachId;
  if (headCoach?.trim()) {
    const coach = await Coach.findById(headCoach).lean();
    if (!coach) throw new Error('Coach not found');
    if (coach.club)
      throw new Error('Coach is already assigned to another club');
    coachId = new Types.ObjectId(headCoach);
  }

  const club = await Club.create({
    name: name.trim(),
    nationality: new Types.ObjectId(nationality),
    logoURL: logoURL.trim(),
    headCoach: coachId,
    numberOfPlayers: 0,
  });

  if (coachId) {
    await Coach.findByIdAndUpdate(coachId, { club: club._id });
  }

  return club;
};

export const update = async (id: string, data: IClub) => {
  const { name, nationality, logoURL, headCoach } = data;
  if (!name?.trim() || !nationality?.trim() || !logoURL?.trim())
    throw new Error('Missing required fields');

  const nation = await Nation.findById(nationality).lean();
  if (!nation) throw new Error('Nation not found');

  const oldClub = await Club.findById(id).lean();
  if (!oldClub) throw new Error('Club not found');

  let coachId;
  if (headCoach?.trim()) {
    const coach = await Coach.findById(headCoach).lean();
    if (!coach) throw new Error('Coach not found');
    if (coach.club && coach.club.toString() !== oldClub._id.toString()) {
      throw new Error('Coach is already assigned to another club');
    }
    coachId = new Types.ObjectId(headCoach);
  }

  const club = await Club.findByIdAndUpdate(
    id,
    {
      name: name.trim(),
      nationality: new Types.ObjectId(nationality),
      logoURL: logoURL.trim(),
      headCoach: coachId,
    },
    { new: true },
  );

  if (!club) throw new Error('Club not found');

  // Sync Coach data if headCoach changed
  if (oldClub.headCoach?.toString() !== coachId?.toString()) {
    // Unset old coach
    if (oldClub.headCoach) {
      await Coach.findByIdAndUpdate(oldClub.headCoach, {
        $unset: { club: '' },
      });
    }
    // Set new coach
    if (coachId) {
      await Coach.findByIdAndUpdate(coachId, { club: club._id });
    }
  }

  return club;
};

export const remove = async (id: string) => {
  const club = await Club.findById(id).lean();
  if (!club) throw new Error('Club not found');

  // Unset coach if any
  if (club.headCoach) {
    await Coach.findByIdAndUpdate(club.headCoach, { $unset: { club: '' } });
  }

  // Also might need to handle players here, but staying focused on the request
  await Club.findByIdAndDelete(id);

  return club;
};
