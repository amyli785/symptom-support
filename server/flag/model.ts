import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Entry} from '../entry/model';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Support
 */

// Type definition for Support on the backend
export type Flag = {
    entry: Types.ObjectId;
    owner: Types.ObjectId;
};

export type PopulatedFlag = {
    entry: Entry;
    owner: User;
  };

const FlagSchema = new Schema({
    // the entry being flagged
    entry: {
        type: Schema.Types.ObjectId,
        ref: "Entry",
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

const FlagModel = model<Flag>('Flag', FlagSchema);
export default FlagModel;