import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { Share , PopulatedShare } from './model';
import EntryCollection from '../entry/collection';
import type { EntryResponse } from '../entry/util';
import { constructEntryResponse } from '../entry/util';

export type ShareResponse = {
  _id: string;
  items: EntryResponse[];
  name: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
 const formatDate = (date: Date): string => date.toString();

/**
 * Transform a raw Share object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Share>} share - A share
 * @returns {ShareResponse} - The share object formatted for the frontend
 */
const constructShareResponse = async (share: HydratedDocument<Share>): Promise<ShareResponse> => {
  const shareCopy: PopulatedShare = {
    ...share.toObject({
      versionKey: false,
    }),
  };

  return {
    _id: share._id.toString(),
    items: await Promise.all(shareCopy.items.map(async entry => {
      const populatedEntry = await EntryCollection.findOneByEntryId(entry._id);
      return constructEntryResponse(populatedEntry);
    })),
    name: shareCopy.name.toString(),
    dateCreated: formatDate(shareCopy.dateCreated),
  };
};

export {
  constructShareResponse,
};