import type {HydratedDocument, Types} from 'mongoose';
import type {Support} from './model';
import SupportModel from './model';
import UserCollection from '../user/collection';

class SupportCollection{
    /**
     * Support a user.
     */
    static async addOne(supporting: Types.ObjectId | string, supporter: Types.ObjectId | string, permission: String): Promise<HydratedDocument<Support>> {
        const support = new SupportModel({
            supporting,
            supporter,
            permission,
            inviteStatus: "invited"
        });
        await support.save()
        return support
    }

    /**
     * Stop supporting a user or remove a user from your supporters.
     * @param supporting - The supporting in the support relationship
     * @param supporter - the user doing the supporting in the support relationship
     * @returns 
     */
    static async deleteOne(supporting: Types.ObjectId | string, supporter: Types.ObjectId | string): Promise<boolean>{
        const support = await SupportModel.deleteOne({supporting: supporting, supporter: supporter});
        return support !== null;
    }

    /**
     * Delete all support relationships containing the user
     * @param userId - the user whose relationships are to be deleted
     */
    static async deleteMany(userId: Types.ObjectId | string): Promise<void>{
        await SupportModel.deleteMany({supporting: userId});
        await SupportModel.deleteMany({supporter: userId});
    }

    /**
     * Find a support by supporting and supporter
     *
     * @param supporting - the user in the supporting position
     * @param supporter - the user in the supporter position
     * @returns a support obeying the above relationship
     */
    static async findOne(supporting: Types.ObjectId | string, supporter: Types.ObjectId | string): Promise<HydratedDocument<Support>> {
        return SupportModel.findOne({supporting: supporting, supporter: supporter});
    }

    /**
     * Find all the Supports for people who the User supports (supporter = userId)
     *
     * @param {string} userId - The userId of the user who is a supporter
     * @return {Promise<HydratedDocument<Support>[]>} - An array of all of the Supports
     */
    static async findAllSupportingByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Support>>> {
        return SupportModel.find({supporter: userId}).populate(['supporting','supporter']);
    }

    /**
     * Find all the Supports for people who support User (supporting = userId)
     *
     * @param {string} userId - The userId whose supporters we want to find
     * @return {Promise<HydratedDocument<Support>[]>} - An array of all of the Supports
     */
     static async findAllSupporterByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Support>>> {
        return SupportModel.find({supporting: userId}).populate(['supporting','supporter']);
    }

    /**
     * Find all the Supports for people who the User supports (supporter = userId) and match the invite status
     *
     * @param {string} userId - The userId whose supporters we want to find
     * @return {Promise<HydratedDocument<Support>[]>} - An array of all of the Supports
     */
     static async findAllSupportingByUserIdAndInviteStatus(userId: Types.ObjectId | string, inviteStatus: string): Promise<Array<HydratedDocument<Support>>> {
        return SupportModel.find({supporter: userId, inviteStatus:inviteStatus}).populate(['supporting','supporter']);
    }
    
    /**
     * Find all the Supports for people who support User (supporting = userId) and match the invite status
     *
     * @param {string} userId - The userId whose supporters we want to find
     * @return {Promise<HydratedDocument<Support>[]>} - An array of all of the Supports
     */
     static async findAllSupporterByUserIdAndInviteStatus(userId: Types.ObjectId | string, inviteStatus: string): Promise<Array<HydratedDocument<Support>>> {
        return SupportModel.find({supporting: userId, inviteStatus:inviteStatus}).populate(['supporting','supporter']);
    }

    /**
     * Update a support with the new permission level
     *
     * @param {string} supporting - The user that's supporting in the relationship
     * @param {string} supporter - The user that is the supporter in the relationship
     * @param {string} permission - The new permission level of the supporter in the support
     * @return {Promise<HydratedDocument<Support>>} - The newly updated support object
     */
    static async updateOnePermission(supporting: Types.ObjectId | string, supporter: Types.ObjectId | string, permission: string): Promise<HydratedDocument<Support>> {
        const support = await SupportModel.findOne({supporting: supporting, supporter: supporter});
        support.permission = permission;
        await support.save();
        return support.populate(['supporting','supporter']);
    }

    /**
     * Update a support with the new invite status
     *
     * @param {string} supporting - The user that's supporting in the relationship
     * @param {string} supporter - The user that is the supporter in the relationship
     * @param {string} inviteStatus - The new inviteStatus of the support
     * @return {Promise<HydratedDocument<Support>>} - The newly updated support object
     */
    static async updateOneInviteStatus(supporting: Types.ObjectId | string, supporter: Types.ObjectId | string, inviteStatus: string): Promise<HydratedDocument<Support>> {
        const support = await SupportModel.findOne({supporting: supporting, supporter: supporter});
        support.inviteStatus = inviteStatus;
        await support.save();
        return support.populate(['supporting','supporter']);
    }

    /**
     * Checks if the supporter for the supporting user is able to view the user's entries
     * @param supporting - the user that's supporting in the relationship
     * @param supporter - the user that's the supporter in the relationship
     * @returns - true if the supporter is a viewer or creator, false otherwise
     */
    static async canView(supporting: Types.ObjectId | string, supporter: Types.ObjectId | string): Promise<boolean> {
        if (supporting.toString() === supporter.toString()) {
            return true;
        }
        const support = await SupportModel.findOne({supporting: supporting, supporter: supporter});
        return !!support;
    }

    /**
     * Checks if the supporter for the supporting user is able to create entries for the user
     * @param supporting - the user that's supporting in the relationship
     * @param supporter - the user that's the supporter in the relationship
     * @returns - true if the supporter is a manager or creator, false otherwise
     */
     static async canCreate(supporting: Types.ObjectId | string, supporter: Types.ObjectId | string): Promise<boolean> {
        if (supporting.toString() === supporter.toString()) {
            return true;
        }
        const support = await SupportModel.findOne({supporting: supporting, supporter: supporter});
        return support && (support.permission == 'manager' || support.permission == 'creator')
    }

    /**
     * Checks if the supporter for the supporting user is able to manage the user's entries
     * @param supporting - the user that's supporting in the relationship
     * @param supporter - the user that's the supporter in the relationship
     * @returns - true if the supporter is a manager, false otherwise
     */
     static async canManage(supporting: Types.ObjectId | string, supporter: Types.ObjectId | string): Promise<boolean> {
        if (supporting.toString() === supporter.toString()) {
            return true;
        }
        const support = await SupportModel.findOne({supporting: supporting, supporter: supporter});
        return support && support.permission == 'manager'
    }
}

export default SupportCollection; 