import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Support, PopulatedSupport} from '../support/model';

type SupportResponse = {
    supporting: string;
    supporter: string;
    permission: string;
    supportingDisplay: string;
    supporterDisplay: string;
    inviteStatus: string;
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

    const supporting = supportCopy.supporting.username;
    const supporter = supportCopy.supporter.username;
    const supportingDisplay = supportCopy.supporting.displayName;
    const supporterDisplay = supportCopy.supporter.displayName;

    return{
        ...supportCopy,
        supporting: supporting,
        supporter: supporter,
        permission: supportCopy.permission.toString(),
        supportingDisplay: supportingDisplay,
        supporterDisplay: supporterDisplay,
        inviteStatus: supportCopy.inviteStatus.toString(),
    };
};

export {
    constructSupportResponse
};