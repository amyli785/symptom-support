import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import SupportCollection from '../support/collection';
import FlagCollection from '../flag/collection';
import * as userValidator from '../user/middleware';
import * as supportValidator from '../support/middleware'
import * as entryValidator from '../entry/middleware'
import * as flagValidator from '../flag/middleware'
import * as util from './util';

const router = express.Router();

/**
 * Add a flag
 *
 * @name POST /api/flags
 *
 * @param {string} entryId - The id of the entry to be flagged
 * @return {FlagResponse} - The created Flag
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If user with username does not exist
 * @throws {409} - If the username belongs to the logged in user
 * @throws {409} - If support relation already exists
 * @throws {400} - If the permission level isn't provided
 * @throws {400} - If the permission level isn't valid (i.e. "creator", "viewer", or "manager")
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        entryValidator.isOwnerCreateable,
        flagValidator.isEntryIdInBody,
        flagValidator.isEntryIdInBodyExists,
        flagValidator.isFlagAlreadyExists,
    ],
    async (req: Request, res: Response) => {
        const entryId = req.body.entryId as string ?? '';
        const flag = await FlagCollection.addOne(entryId);

        res.status(201).json({
            message: `You flagged entry ${req.body.entryId as string} successfully.`,
            support: util.constructFlagResponse(flag)
        });
    }
);

/**
 * Unflag an entry.
 *
 * @name DELETE /api/flags/:entryId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If user with username does not exist
 * @throws {409} - If username belongs to logged in user
 * @throws {404} - If the support relationship does not exist
 */
 router.delete(
    '/:entryId?',
    [
        userValidator.isUserLoggedIn,
        flagValidator.isEntryIdInParams,
        entryValidator.isEntryIdManageable,
        entryValidator.isEntryIdExists,
    ],
    async (req: Request, res: Response) => {
        await FlagCollection.deleteOne(req.params.entryId as string);

        res.status(200).json({
            message: `You unflagged Entry ${req.params.entryId as string} successfully.`,
        });
    }
);

/**
 * Get flag by entryId
 *
 * @name GET /api/flags?entryId=entryId
 *
 * @return {FlagResponse} - The flag with entryId = entryId
 * @throws {400} - If inviteStatus is not provided
 * @throws {400} - If inviteStatus is not valid (i.e. "invited" or "accepted")
 *
 */
 router.get(
    '/',
    [
        userValidator.isUserLoggedIn,
        flagValidator.isEntryIdQueryViewable,
        flagValidator.isFlagInQueryExists,
    ],
    async (req:Request, res:Response) => {
        if (req.query.entryId !== undefined) {
            let userId = (req.session.userId as string) ?? '';
            if (userId === ''){userId = undefined};
            const flag = await FlagCollection.findOneByEntryId(req.query.entryId as string);
            const response = util.constructFlagResponse(flag);
            res.status(200).json(response);
        }
    }
)

/**
 * Get all flags for owner who has username = username
 *
 * @name GET /api/flags?username=username
 *
 * @return {FlagResponse[]} - The flags where owner has username = username
 * @throws {400} - If inviteStatus is not provided
 * @throws {400} - If inviteStatus is not valid (i.e. "invited" or "accepted")
 *
 */
 router.get(
    '/',
    [
        userValidator.isUserLoggedIn,
        flagValidator.isUserFlagsViewable,
    ],
    async (req:Request, res:Response) => {
        if (req.query.username !== undefined) {
            const username = req.query.username as string;
            const owner = await UserCollection.findOneByUsername(username);
            const allFlags = await FlagCollection.findAllFlagByUserId(owner._id);
            const response = allFlags.map(util.constructFlagResponse);
            res.status(200).json(response);
        }
    }
)

export {router as flagRouter};