import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Support, PopulatedSupport} from '../support/model';

type SupportResponse = {
    supported: string;
    supporter: string;
    permission: string;
};

/**
 * Transform a raw Support object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Support>} support - A support
 * @returns {SupportResponse} - The support object formatted for the frontend
 */
const constructSupportResponse = (support: HydratedDocument<Support>): SupportResponse => {
    const supportCopy: PopulatedSupport = {
        ...support.toObject({
            versionKey:false
        })
    };

    const supported = supportCopy.supported.username;
    const supporter = supportCopy.supporter.username;

    return{
        ...supportCopy,
        supported: supported,
        supporter: supporter,
        permission: supportCopy.permission.toString()
    };
};

export {
    constructSupportResponse
};