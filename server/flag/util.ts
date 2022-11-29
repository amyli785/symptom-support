import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Flag, PopulatedFlag} from '../flag/model';

type FlagResponse = {
    entry: string;
    owner: string;
};

/**
 * Transform a raw Flag object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Flag>} flag - A Flag
 * @returns {FlagResponse} - The flag object formatted for the frontend
 */
const constructFlagResponse = (flag: HydratedDocument<Flag>): FlagResponse => {
    const flagCopy: PopulatedFlag = {
        ...flag.toObject({
            versionKey:false
        })
    };

    const entryId = flagCopy.entry._id.toString();
    const owner = flagCopy.owner.username;

    return{
        ...flagCopy,
        entry: entryId,
        owner: owner,
    };
};

export {
    constructFlagResponse
};