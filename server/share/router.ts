import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ShareCollection from './collection';
import * as userValidator from '../user/middleware';
import * as shareValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the share with the share id.
 *
 * @name GET /api/shares/:shareId
 *
 * @return {ShareResponse} - The share with shareId, if any
 * @throws {403} - If user not logged in
 * @throws {400} - If `shareId` is empty or not in the correct format
 * @throws {404} - If no share with `shareId` exists
 */
 router.get(
  '/:shareId?',
  [
    userValidator.isUserLoggedIn,
    shareValidator.isShareIdExists,
  ],
  async (req:Request, res:Response, next: NextFunction) => {
    const share = await ShareCollection.findOneByShareId(req.params.shareId as string);
    const response = await util.constructShareResponse(share);
    res.status(200).json(response);
  },
);

/**
 * Add a new share.
 *
 * @name POST /api/shares
 * 
 * @param {Array<string>} entryIds - The ids of the entries of the share
 * @param {string} name - The name of the share
 * @return {ShareResponse} - The created share
 * @throws {403} - If the user is not logged in
 * @throws {400} - If `entryIds` is not an array or contains an element that is not a properly formatted object id
 * @throws {404} - If `entryIds` contains an entryId that does not exist
 * @throws {403} - If the user is not the owner of any entry in `entryIds`
 * @throws {400} - If `name` is empty
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    shareValidator.isEntryIdsValid,
    shareValidator.isEntryIdsExistAndShareable,
    shareValidator.isNameValid,
  ],
  async (req: Request, res: Response) => {
    const share = await ShareCollection.addOne(req.body.entryIds, req.body.name);

    res.status(201).json({
      message: `You added a new share named ${req.body.name as string} successfully.`,
      entry: await util.constructShareResponse(share),
    });
  }
);

export {router as shareRouter};