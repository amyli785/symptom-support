import type {HydratedDocument, Types} from 'mongoose';
import type {Support} from './model';
import SupportModel from './model';
import UserCollection from '../user/collection';

class SupportCollection{
    /**
     * Support a user.
     */
    static async addOne(supported: Types.ObjectId | string, supporter: Types.ObjectId | string): Promise<HydratedDocument<Support>> {
        const support = new SupportModel({
            supported,
            supporter
        });
        await support.save()
        return support
    }

    /**
     * Stop supporting a user or remove a user from your supporters.
     * @param supported - The supported in the support relationship
     * @param supporter - the user doing the supporting in the support relationship
     * @returns 
     */
    static async deleteOne(supported: Types.ObjectId | string, supporter: Types.ObjectId | string): Promise<boolean>{
        const support = await SupportModel.deleteOne({supported: supported, supporter: supporter});
        return support !== null;
    }

    /**
     * Delete all support relationships containing the user
     * @param userId - the user whose relationships are to be deleted
     */
    static async deleteMany(userId: Types.ObjectId | string): Promise<void>{
        await SupportModel.deleteMany({supported: userId});
        await SupportModel.deleteMany({supporter: userId});
    }

    /**
     * Find a support by supported and supporter
     *
     * @param supported - the user in the supported position
     * @param supporter - the user in the supporter position
     * @returns a support obeying the above relationship
     */
    static async findOne(supported: Types.ObjectId | string, supporter: Types.ObjectId | string): Promise<HydratedDocument<Support>> {
        return SupportModel.findOne({supported: supported, supporter: supporter});
    }

    /**
     * Find all the Supports for people who the User supports (supporter = userId)
     *
     * @param {string} userId - The userId of the user who is a supporter
     * @return {Promise<HydratedDocument<Support>[]>} - An array of all of the Supports
     */
    static async findAllSupportedByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Support>>> {
        return SupportModel.find({supporter: userId}).populate(['supported','supporter']);
    }

    /**
     * Find all the Supports for people who support User (supported = userId)
     *
     * @param {string} userId - The userId whose supporters we want to find
     * @return {Promise<HydratedDocument<Support>[]>} - An array of all of the Supports
     */
     static async findAllSupporterByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Support>>> {
        return SupportModel.find({supported: userId}).populate(['supported','supporter']);
    }
}

export default SupportCollection; 