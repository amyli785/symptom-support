import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import SupportCollection from './collection';
import * as userValidator from '../user/middleware';
import * as supportValidator from '../support/middleware'
import * as util from './util';

const router = express.Router();

/**
 * Add user as supporter.
 *
 * @name POST /api/supports
 *
 * @param {string} username - The username of the user to add as supporter
 * @return {SupportResponse} - The created Support
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If user with username does not exist
 * @throws {409} - If the username belongs to the logged in user
 * @throws {409} - If support relation already exists
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserInBodyExists,
        userValidator.isBodyNotEqualLoggedInUser,
        supportValidator.isSupportAlreadyExists
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const supporter = await UserCollection.findOneByUsername(req.body.username);
        const support = await SupportCollection.addOne(userId,supporter._id);

        res.status(201).json({
            message: `You added ${req.body.username} as a supporter successfully.`,
            support: util.constructSupportResponse(support)
        });
    }
);

/**
 * Remove user as a supporter.
 *
 * @name DELETE /api/supports/supporter/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If user with username does not exist
 * @throws {409} - If the username belongs to the logged in user
 * @throws {404} - If support relationship does not exist
 */
router.delete(
    '/supporter/:username?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserParamExists,
        userValidator.isParamsNotEqualLoggedInUser,
        supportValidator.isSupportDoesNotExist,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const supporter = await UserCollection.findOneByUsername(req.params.username);
        await SupportCollection.deleteOne(userId,supporter._id);

        const support = await SupportCollection.findOne(userId, supporter._id);

        res.status(200).json({
            message: `Your removed ${req.params.username} as a supporter successfully.`,
        });
    }
);

/**
 * Remove a user from the logged in user's supported list.
 *
 * @name DELETE /api/supports/supported/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If user with username does not exist
 * @throws {409} - If username belongs to logged in user
 * @throws {404} - If follow relationship does not exist
 */
 router.delete(
    '/supported/:username?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserParamExists,
        userValidator.isParamsNotEqualLoggedInUser,
        supportValidator.isSupportedDoesNotExist,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const supported = await UserCollection.findOneByUsername(req.params.username);
        await SupportCollection.deleteOne(supported._id,userId);

        const support = await SupportCollection.findOne(supported._id, userId);

        res.status(200).json({
            message: `You stopped supporting ${req.params.username} successfully.`,
        });
    }
);

/**
 * Get all of user's supported.
 *
 * @name GET /api/supports/supported
 *
 * @return {SupportResponse[]} - An array of supports where supporter = user
 * @throws {403} - If user not logged in
 *
 */
router.get(
    '/supported',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req:Request, res:Response) => {
        const userId = (req.session.userId as string) ?? '';
        const allSupported = await SupportCollection.findAllSupportedByUserId(userId);
        const response = allSupported.map(util.constructSupportResponse);
        res.status(200).json(response);
    }
)

/**
 * Get all of the users that the logged in user has added as supporters.
 *
 * @name GET /api/supports/supporter
 *
 * @return {SupportResponse[]} - An array of supports where supported = user
 * @throws {403} - If user not logged in
 *
 */
router.get(
    '/supporter',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req:Request, res:Response) => {
        const userId = (req.session.userId as string) ?? '';
        const allSupporter = await SupportCollection.findAllSupporterByUserId(userId);
        const response = allSupporter.map(util.constructSupportResponse);
        res.status(200).json(response);
    }
)

export {router as supportRouter};