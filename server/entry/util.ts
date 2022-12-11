import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { Entry , PopulatedEntry } from './model';
import type { Symptom } from '../symptom/model';
import type { Medication } from '../medication/model';
import FlagCollection from '../flag/collection';

export type EntryResponse = {
  _id: string;
  owner: string;
  author: string;
  dateStarted: string;
  dateEnded: string;
  symptoms: Symptom[];
  medications: Medication[];
  mood: string;
  notes: string;
  flag: boolean;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => date.toString();

/**
 * Transform a raw Entry object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Entry>} entry - An entry
 * @returns {EntryResponse} - The entry object formatted for the frontend
 */
const constructEntryResponse = async (entry: HydratedDocument<Entry>): Promise<EntryResponse> => {
  const entryCopy: PopulatedEntry = {
    ...entry.toObject({
      versionKey: false,
    }),
  };

  const flag = await FlagCollection.findOneByEntryId(entry._id);

  return {
    _id: entry._id.toString(),
    owner: entryCopy.owner.username,
    author: entryCopy.author.username,
    dateStarted: formatDate(entryCopy.dateStarted),
    dateEnded: entryCopy.dateEnded ? formatDate(entryCopy.dateEnded) : '',
    symptoms: entryCopy.symptoms,
    medications: entryCopy.medications,
    mood: entryCopy.mood ? entryCopy.mood.toString() : '',
    notes: entryCopy.notes ? entryCopy.notes.toString() : '',
    flag: !!flag,
  };
};

export {
  constructEntryResponse,
};