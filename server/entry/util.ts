import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { Entry , PopulatedEntry } from './model';
import type { Symptom } from '../symptom/model';
import type { Medication } from '../medication/model';

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
const constructEntryResponse = (entry: HydratedDocument<Entry>): EntryResponse => {
  const entryCopy: PopulatedEntry = {
    ...entry.toObject({
      versionKey: false,
    }),
  };

  return {
    _id: entry._id.toString(),
    owner: entryCopy.owner.username,
    author: entryCopy.author.username,
    dateStarted: entryCopy.dateStarted as string,
    dateEnded: entryCopy.dateEnded as string,
    symptoms: entryCopy.symptoms,
    medications: entryCopy.medications,
    mood: entryCopy.mood ? entryCopy.mood.toString() : '',
    notes: entryCopy.notes ? entryCopy.notes.toString() : '',
  };
};

export {
  constructEntryResponse,
};