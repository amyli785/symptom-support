import type {Types} from 'mongoose';
import { Schema, model } from 'mongoose';

/**
 * This file defines the properties stored in a Medication.
 */

// Type definition for Medication on the backend
export type Medication = {
    _id: Types.ObjectId,
    name: String,
    dosage: Number,
    unit: String
};

export type PopulatedMedication = {
    name: String,
    dosage: Number,
    unit: String
};

const MedicationSchema = new Schema({
    // The name of the medication
    name: {
        type: String,
        required: true
    },
    
    // The dosage of the medication (in the corresponding unit)
    dosage: {
        type: Number,
        required: true
    },

    // The unit of the dosage
    unit: {
        type: String,
        required: true
    }
});

const MedicationModel = model<Medication>('Medication', MedicationSchema);
export default MedicationModel;