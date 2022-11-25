import type {Types} from 'mongoose';
import { Schema, model } from 'mongoose';

/**
 * This file defines the propoerties stored in a Medication.
 */

// Type definition for Medication on the backend
export type Medication = {
    _id: Types.ObjectId,
    name: String,
    dosage: Number
};

export type PopulatedMedication = {
    name: String,
    dosage: Number
};

const MedicationSchema = new Schema({
    // The name of the medication
    name: {
        type: String,
        required: true
    },
    
    // The dosage of the medication (in mg)
    dosage: {
        type: Number,
        required: true
    }
});

const MedicationModel = model<Medication>('Medication', MedicationSchema);
export default MedicationModel;