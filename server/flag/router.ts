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
 * @throws {400} - If entryId is not provided or not a correctly formatted Object ID
 * @throws {404} - If entry with id = entryId does not exist
 * @throws {403} - If the logged in user does not have permission to create for the entry owner
 * @throws {409} - If the flag already exists
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        flagValidator.isEntryIdInBody,
        flagValidator.isEntryIdInBodyExists,
        flagValidator.isEntryIdCreateable,
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
 * @throws {400} - If entryId is not provided or is not a valid Object ID
 * @throws {404} - If entry with id = entryId does not exist
 * @throws {403} - If the logged in user does not have permission to manage the entry
 */
 router.delete(
    '/:entryId?',
    [
        userValidator.isUserLoggedIn,
        flagValidator.isEntryIdInParams,
        entryValidator.isEntryIdExists,
        entryValidator.isEntryIdManageable,
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
 * @throws {403} - If the user is not logged in
 * @throws {400} - If entryId not provided
 * @throws {400} - If entryId is not a valid Object ID
 * @throws {403} - If the entry with id = entryId does not exist
 * @throws {403} - If the entry with id = entryId is not viewable by the logged in user
 * @throws {403} - If the flag of entry with id = entryId does not exist
 *
 */
/**
 * Get all flags for owner who has username = username
 *
 * @name GET /api/flags?username=username
 *
 * @return {FlagResponse[]} - The flags where owner has username = username
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username not provided
 * @throws {404} - If the user with username does not exist
 * @throws {403} - If the logged in user does not have permission to view username's flags
 *
 */
 router.get(
    '/',
    [
        userValidator.isUserLoggedIn,
        flagValidator.isValidQueryProvided,
        flagValidator.isEntryIdInQueryExists,
        flagValidator.isEntryIdQueryViewable,
        // flagValidator.isFlagInQueryExists,
        flagValidator.isUserInQueryExists,
        flagValidator.isUserFlagsViewable,
    ],
    async (req:Request, res:Response) => {
        if (req.query.entryId !== undefined) {
            const flag = await FlagCollection.findOneByEntryId(req.query.entryId as string);
            let response: boolean = false
            if (flag){
                response = true;
            }
            res.status(200).json(response);
            return;
        }
        else if (req.query.username !== undefined) {
            const username = req.query.username as string;
            const owner = await UserCollection.findOneByUsername(username);
            const allFlags = await FlagCollection.findAllFlagByUserId(owner._id);
            const response = allFlags.map(util.constructFlagResponse);
            res.status(200).json(response);
            return;
        }
    }
)

export {router as flagRouter};