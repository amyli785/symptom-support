import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Support
 */

// Type definition for Support on the backend
export type Support = {
    supported: Types.ObjectId;
    supporter: Types.ObjectId;
    permission: String;
};

export type PopulatedSupport = {
    supported: User;
    supporter: User;
    permission: String;
  };

const SupportSchema = new Schema({
    // the user being supported
    supported: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // the user who is the supported
    supporter: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    permission: {
        type: String,
        required: true,
    }
});

const SupportModel = model<Support>('Support', SupportSchema);
export default SupportModel;