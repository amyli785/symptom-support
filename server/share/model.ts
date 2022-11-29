import type {Types} from 'mongoose';
import { Schema, model } from 'mongoose';
import type { Entry } from '../entry/model';

/**
 * This file defines the properties stored in a Share.
 */

// Type definition for Share on the backend
export type Share = {
  _id: Types.ObjectId,
  items: Types.ObjectId[],
  name: String,
  dateCreated: Date,
};

export type PopulatedShare = {
  items: Entry[],
  name: String,
  dateCreated: Date,
};

const ShareSchema = new Schema({
  // The items of the share
  items: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Entry',
  },

  // The name of the share
  name: {
    type: String,
    required: true,
  },
  
  // The date created of the share
  dateCreated: {
    type: Date,
    required: true,
  },
});

const ShareModel = model<Share>('Share', ShareSchema);
export default ShareModel;