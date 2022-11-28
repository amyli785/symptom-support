import type {Types} from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';
import type { Symptom } from '../symptom/model';
import type { Medication } from '../medication/model';

/**
 * This file defines the properties stored in a Entry.
 */

// Type definition for Entry on the backend
export type Entry = {
  _id: Types.ObjectId,
  owner: Types.ObjectId,
  author: Types.ObjectId,
  dateStarted: Date,
  dateEnded: Date,
  symptoms: Types.ObjectId[],
  medications: Types.ObjectId[],
  mood: Number,
  notes: String,
};

export type PopulatedEntry = {
  owner: User,
  author: User,
  dateStarted: Date,
  dateEnded: Date,
  symptoms: Symptom[],
  medications: Medication[],
  mood: Number,
  notes: String,
};

const EntrySchema = new Schema({
  // The owner (patient) of the entry
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  
  // The author of the entry
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  
  // The date started of the content of the entry
  dateStarted: {
    type: Date,
    required: true,
  },
  
  // The date ended of the content of the entry
  dateEnded: {
    type: Date,
    required: false,
  },
  
  // The symptoms in the entry
  symptoms: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Symptom',
  },
  
  // The medications in the entry
  medications: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Medication',
  },
  
  // The mood of the entry
  mood: {
    type: Number,
    required: false,
  },
  
  // The notes of the entry
  notes: {
    type: String,
    required: false,
  },
});

const EntryModel = model<Entry>('Entry', EntrySchema);
export default EntryModel;