import type { HydratedDocument , Types } from 'mongoose';
import type { Share } from './model';
import ShareModel from './model';

class ShareCollection {
  /**
   * Add a new share.
   * 
   * @param {Array<string>} items - The ids of the items (entries) of the share
   * @param {string} name - The name of the share
   * @return {Promise<HydratedDocument<Share>>} - The newly created share
   */
  static async addOne(items: (Types.ObjectId | string)[], name: string | undefined): Promise<HydratedDocument<Share>> {
    const dateCreated = new Date();
    const share = new ShareModel({items, name, dateCreated});
    return share.save();
  }

  /**
   * Find a share by shareId.
   * 
   * @param {string} shareId - The shareId of the share to find
   * @return {Promise<HydratedDocument<Share>> | Promise<null>} - The share with the given id, if any
   */
  static async findOneByShareId(shareId: Types.ObjectId | string): Promise<HydratedDocument<Share>> {
    const share = await ShareModel.findOne({_id: shareId});
    return share;
  }

  /**
   * Delete a share from the collection. 
   * 
   * @param {string} shareId - The shareId of the share to delete
   * @return {Promise<Boolean>} - true if the share has been deleted, false otherwise
   */
  static async deleteOne(shareId: Types.ObjectId | string): Promise<boolean>{
    const share = await ShareModel.deleteOne({_id: shareId});
    return share !== null;
  }
}

export default ShareCollection;