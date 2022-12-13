import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Support
 */

// Type definition for Support on the backend
export type Support = {
    supporting: Types.ObjectId;
    supporter: Types.ObjectId;
    permission: String;
    inviteStatus: String;
};

export type PopulatedSupport = {
    supporting: User;
    supporter: User;
    permission: String;
    inviteStatus: String;
  };

const SupportSchema = new Schema({
    // the user being supporting
    supporting: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // the user who is the supporting
    supporter: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    permission: {
        type: String,
        required: true,
    },

    inviteStatus: {
        type: String,
        required: true
    }
});

const SupportModel = model<Support>('Support', SupportSchema);
export default SupportModel;