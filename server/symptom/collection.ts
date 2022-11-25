import type {HydratedDocument, Types} from 'mongoose';
import type {Symptom} from './model';
import SymptomModel from './model';

class SymptomCollection {
    /**
     * Add a new symptom.
     * 
     * @param {string} name - The name of the symptom
     * @param {number} intensity - The intensity of the symptom (out of 10)
     * @param {string} location - The location of the symptom
     * @return {Promise<HydratedDocument<Symptom>>} - The newly created symptom
     */
    static async addOne(name: string, intensity: number, location?: string): Promise<HydratedDocument<Symptom>> {
        const symptom = new SymptomModel({name, intensity, location});
        await symptom.save();
        return symptom;
    }

    /**
     * Find a symptom by symptomId
     * 
     * @param {string} symptomId - The symptomId of the symptom to find
     * @return {Promise<HydratedDocument<Symptom>> | Promise<null>} - The symptom with the given id, if any
     */
    static async findOneBySymptomId(symptomId: Types.ObjectId | string): Promise<HydratedDocument<Symptom>> {
        return SymptomModel.findOne({_id: symptomId});
    }

    /**
     * Delete a symptom from the collection. 
     * 
     * @param {string} symptomId - The symptomId of the symptom to delete
     * @return {Promise<Boolean>} - true if the symptom has been deleted, false otherwise
     */
    static async deleteOne(symptomId: Types.ObjectId | string): Promise<boolean>{
        const symptom = await SymptomModel.deleteOne({_id: symptomId});
        return symptomId !== null;
    }


    /**
     * Update a symptom from the collection.
     * 
     * @param {string} symptomId - The symptomId of the symptom to udpate
     * @param {Object} symptomDetails - An object with the symptoms's updated information
     * @return {Promise<HydratedDocument<Symptom>>} - The updated symptom
     */
     static async updateOne(symptomId: Types.ObjectId | string, symptomDetails: {name?: string, intensity?: number, location?: string}): Promise<HydratedDocument<Symptom>>{
        const symptom = await SymptomModel.findOne({_id: symptomId});
        if (symptomDetails.name){
            symptom.name = symptomDetails.name;
        }

        if (symptomDetails.intensity){
            symptom.intensity = symptomDetails.intensity;
        }

        if (symptomDetails.location) {
            symptom.location = symptomDetails.location;
        }

        await symptom.save();
        return symptom;
    }
    
}

export default SymptomCollection;