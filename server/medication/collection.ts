import type {HydratedDocument, StringExpressionOperatorReturningNumber, Types} from 'mongoose';
import type {Medication} from './model';
import MedicationModel from './model';

class MedicationCollection {
    /**
     * Add a new medication.
     * 
     * @param {string} name - The name of the medication
     * @param {number} dosage - The dosage of the medication 
     * @param {string} unit - The unit of the dosage
     * @return {Promise<HydratedDocument<Medication>>} - The newly created medication
     */
    static async addOne(name: string, dosage: number, unit: string): Promise<HydratedDocument<Medication>> {
        const medication = new MedicationModel({name, dosage, unit});
        await medication.save();
        return medication;
    }

    /**
     * Find a medication by medicationId
     * 
     * @param {string} medicationId - The medicationId of the medication to find
     * @return {Promise<HydratedDocument<Medication>> | Promise<null>} - The medication with the given id, if any
     */
    static async findOneByMedicationId(medicationId: Types.ObjectId | string): Promise<HydratedDocument<Medication>> {
        return MedicationModel.findOne({_id: medicationId});
    }

    /**
     * Delete a medication from the collection. 
     * 
     * @param {string} medicationId - The medicationId of the medication to delete
     * @return {Promise<Boolean>} - true if the medication has been deleted, false otherwise
     */
    static async deleteOne(medicationId: Types.ObjectId | string): Promise<boolean>{
        const medication = await MedicationModel.deleteOne({_id: medicationId});
        return medication !== null;
    }


    /**
     * Update a medication from the collection.
     * 
     * @param {string} medicationId - The medicationId of the medication to udpate
     * @param {Object} medicationDetails - An object with the medication's updated information
     * @return {Promise<HydratedDocument<Medication>>} - The updated medication
     */
     static async updateOne(medicationId: Types.ObjectId | string, medicationDetails: {name?: string, dosage?: number, unit?: string}): Promise<HydratedDocument<Medication>>{
        const medication = await MedicationModel.findOne({_id: medicationId});
        if (medicationDetails.name){
            medication.name = medicationDetails.name;
        }

        if (medicationDetails.dosage){
            medication.dosage = medicationDetails.dosage;
        }

        if (medicationDetails.unit){
            medication.unit = medicationDetails.unit;
        }

        await medication.save();
        return medication;
    }
    
}

export default MedicationCollection;