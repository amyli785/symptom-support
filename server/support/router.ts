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
        supportValidator.isSupportAlreadyExists,
        supportValidator.isPermissionInBody
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const supporter = await UserCollection.findOneByUsername(req.body.username);
        const permission = req.body.permission as string ?? '';
        const support = await SupportCollection.addOne(userId,supporter._id, permission);

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
/**
 * Get freets by author.
 *
 * @name GET /api/supports/supported?inviteStatus=inviteStatus
 *
 * @return {SupporttResponse[]} - An array of supports where supporter = user and match the invite status
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
    '/supported',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req:Request, res:Response, next: NextFunction) => {
        if (req.query.inviteStatus !== undefined) {
            next();
            return;
        }
        const userId = (req.session.userId as string) ?? '';
        const allSupported = await SupportCollection.findAllSupportedByUserId(userId);
        const response = allSupported.map(util.constructSupportResponse);
        res.status(200).json(response);
    },
    [
        // other middleware?
    ],
    async (req:Request, res:Response) => {
        let userId = (req.session.userId as string) ?? '';
        if (userId === ''){userId = undefined};
        const allSupported = await SupportCollection.findAllSupportedByUserIdAndInviteStatus(userId,req.query.inviteStatus as string);
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
    async (req:Request, res:Response, next:NextFunction) => {
        if (req.query.inviteStatus !== undefined) {
            next();
            return;
        }
        const userId = (req.session.userId as string) ?? '';
        const allSupporter = await SupportCollection.findAllSupporterByUserId(userId);
        const response = allSupporter.map(util.constructSupportResponse);
        res.status(200).json(response);
    },
    [
        // other middleware?
    ],
    async (req:Request, res: Response, next:NextFunction) => {
        let userId = (req.session.userId as string) ?? '';
        if (userId === ''){userId = undefined};
        const allSupporter = await SupportCollection.findAllSupporterByUserIdAndInviteStatus(userId,req.query.inviteStatus as string);
        const response = allSupporter.map(util.constructSupportResponse);
        res.status(200).json(response);
    }
)

/**
 * Modify a support
 *
 * @name PATCH /api/supports/supporter/:username
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
    '/supporter/:username?',
    [
        userValidator.isUserLoggedIn,
        supportValidator.isSupportBySupporterExists,
        // supportValidator.isPermissionInBody,
        supportValidator.isValidUpdatePermission,
    ],
    async (req: Request, res: Response) => {
        let support = undefined;
  
        const supported = (req.session.userId as string) ?? '';
        const supporter = await UserCollection.findOneByUsername(req.params.username);
        if (req.body.permission){
            support = await SupportCollection.updateOnePermission(supported, supporter._id, req.body.permission);
            res.status(200).json({
                message: 'Your support was updated successfully.',
                support: util.constructSupportResponse(support)
            });
        }
        else{
            res.status(400).json({
                error: 'No update content provided.'
            });
        }
    }
  );

/**
 * Modify a support
 *
 * @name PATCH /api/supports/supported/:username
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
    '/supported/:username?',
    [
        userValidator.isUserLoggedIn,
        supportValidator.isSupportBySupportedExists,
        supportValidator.isValidUpdatePermission,
    ],
    async (req: Request, res: Response) => {
        let support = undefined;

        const supporter = (req.session.userId as string) ?? '';
        const supported = await UserCollection.findOneByUsername(req.params.username);
        if (req.body.inviteStatus){
            support = await SupportCollection.updateOneInviteStatus(supported._id, supporter, req.body.inviteStatus);
            res.status(200).json({
                message: 'Your support was accepted successfully.',
                support: util.constructSupportResponse(support)
            });
        }
        else{
            res.status(400).json({
                error: 'No update content provided.'
            });
        }
    }
);

export {router as supportRouter};