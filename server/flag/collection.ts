import type {HydratedDocument, Types} from 'mongoose';
import type {Flag,PopulatedFlag} from './model';
import FlagModel from './model';
import UserCollection from '../user/collection';
import EntryCollection from '../entry/collection';

class FlagCollection {
    /**
     * Flag an entry.
     */
    static async addOne(entryId: Types.ObjectId | string): Promise<HydratedDocument<Flag>> {
        const entry = await EntryCollection.findOneByEntryId(entryId);
        const flag = new FlagModel({
            entry: entryId,
            owner: entry.owner._id
        });
        await flag.save()
        return flag
    }

    /**
     * Find an entry by entryId
     * 
     * @param {string} entryId - The entryId of the entry to find
     * @return {Promise<HydratedDocument<Flag>> | Promise<null>} - The flag of the entry with the given id, if any
     */
    static async findOneByEntryId(entryId: Types.ObjectId | string): Promise<HydratedDocument<Flag>> {
        return FlagModel.findOne({entry: entryId}).populate(['entry', 'owner']);
    }

    /**
     * Find all the flags whose owner = userId
     *
     * @param {string} userId - The userId of the owner
     * @return {Promise<HydratedDocument<Flag>[]>} - An array of all of the Flags
     */
    static async findAllFlagByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Flag>>> {
        // return FlagModel.find({owner: userId}).populate(['entry','owner']);
        const entries = await EntryCollection.findAllByOwner(userId);
        const flags = []
        for (const entry of entries){
            const flag = await FlagCollection.findOneByEntryId(entry._id)
            if (flag){
                flags.push(flag)
            }
        }

        return flags
    }

    /**
     * Unflag an entry
     * @param entryId - The ID of the entry to unflag
     * @returns 
     */
    static async deleteOne(entryId: Types.ObjectId | string): Promise<boolean>{
        const flag = await FlagModel.deleteOne({entry: entryId});
        return flag !== null;
    }

    /**
     * Delete all flags where user with id = userId is the owner
     * @param userId - the user whose flags are to be deleted
     */
    static async deleteMany(userId: Types.ObjectId | string): Promise<void>{
        await FlagModel.deleteMany({owner: userId});
    }
}

export default FlagCollection;