import type {Types} from 'mongoose';
import { Schema, model } from 'mongoose';

/**
 * This file defines the properties stored in a Symptom.
 */

// Type definition for Symptom on the backend
export type Symptom = {
    _id: Types.ObjectId,
    name: String,
    measurement: Number,
    unit: String,
    location: String
}

export type PopulatedSymptom = {
    name: String,
    measurement: Number,
    unit: String,
    location: String
}

const SymptomSchema = new Schema ({
    // The name of the symptom
    name: {
        type: String,
        required: true
    },

    // The value of the measurement
    measurement: {
        type: Number,
        required: false
    },

    // The unit of the measurement
    unit: {
        type: String,
        required: false
    },
    
    // The location of the symptom
    location: {
        type: String,
        required: false
    }
});

const SymptomModel = model<Symptom>('Symptom', SymptomSchema);
export default SymptomModel;

