import type {Types} from 'mongoose';
import { Schema, model } from 'mongoose';

/**
 * This file defines the properties stored in a Symptom.
 */

// Type definition for Symptom on the backend
export type Symptom = {
    _id: Types.ObjectId,
    name: String,
    intensity: Number,
    location: String
}

export type PopulatedSymptom = {
    name: String,
    intensity: Number,
    location: String
}

const SymptomSchema = new Schema ({
    // The name of the symptom
    name: {
        type: String,
        required: true
    },

    // The intensity of the symptom (out of 10)
    intensity: {
        type: Number,
        required: true
    },

    // The location of the symptom
    location: {
        type: String,
        required: false
    }
});

const SymptomModel = model<Symptom>('Symptom', SymptomSchema);
export default SymptomModel;

