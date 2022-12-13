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
 * @throws {400} - If the permission level isn't provided
 * @throws {400} - If the permission level isn't valid (i.e. "creator", "viewer", or "manager")
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserInBodyExists,
        userValidator.isBodyNotEqualLoggedInUser,
        supportValidator.isSupportAlreadyExists,
        supportValidator.isPermissionInBody,
        supportValidator.isValidUpdatePermission,
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
            message: `You removed ${req.params.username} as a supporter successfully.`,
        });
    }
);

/**
 * Remove a user from the logged in user's supporting list.
 *
 * @name DELETE /api/supports/supporting/:username
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If username is not provided
 * @throws {404} - If user with username does not exist
 * @throws {409} - If username belongs to logged in user
 * @throws {404} - If the support relationship does not exist
 */
 router.delete(
    '/supporting/:username?',
    [
        userValidator.isUserLoggedIn,
        userValidator.isUserParamExists,
        userValidator.isParamsNotEqualLoggedInUser,
        supportValidator.isSupportingDoesNotExist,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const supporting = await UserCollection.findOneByUsername(req.params.username);
        await SupportCollection.deleteOne(supporting._id,userId);

        const support = await SupportCollection.findOne(supporting._id, userId);

        res.status(200).json({
            message: `You stopped supporting ${req.params.username} successfully.`,
        });
    }
);

/**
 * Get all of user's supporting.
 *
 * @name GET /api/supports/supporting
 *
 * @return {SupportResponse[]} - An array of supports where supporter = user
 * @throws {403} - If user not logged in
 *
 */
/**
 * Get user's supporting by invite status.
 *
 * @name GET /api/supports/supporting?inviteStatus=inviteStatus
 *
 * @return {SupporttResponse[]} - An array of supports where supporter = user and match the invite status
 * @throws {400} - If inviteStatus is not provided
 * @throws {400} - If inviteStatus is not valid (i.e. "invited" or "accepted")
 *
 */
router.get(
    '/supporting',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req:Request, res:Response, next: NextFunction) => {
        if (req.query.inviteStatus !== undefined) {
            next();
            return;
        }
        const userId = (req.session.userId as string) ?? '';
        const allSupporting = await SupportCollection.findAllSupportingByUserId(userId);
        const response = allSupporting.map(util.constructSupportResponse);
        res.status(200).json(response);
    },
    [
        supportValidator.isInviteStatusInQuery,
        supportValidator.isValidQueryInviteStatus
    ],
    async (req:Request, res:Response) => {
        let userId = (req.session.userId as string) ?? '';
        if (userId === ''){userId = undefined};
        const allSupporting = await SupportCollection.findAllSupportingByUserIdAndInviteStatus(userId,req.query.inviteStatus as string);
        const response = allSupporting.map(util.constructSupportResponse);
        res.status(200).json(response);
    }
)


/**
 * Get all of the users that the logged in user has added as supporters.
 *
 * @name GET /api/supports/supporter
 *
 * @return {SupportResponse[]} - An array of supports where supporting = user
 * @throws {403} - If user not logged in
 *
 */
/**
 * Get user's supporters by invite status.
 *
 * @name GET /api/supports/supporter?inviteStatus=inviteStatus
 *
 * @return {SupporttResponse[]} - An array of supports where supporting = user and match the invite status
 * @throws {400} - If inviteStatus is not provided
 * @throws {400} - If inviteStatus is not valid (i.e. "invited" or "accepted")
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
        supportValidator.isInviteStatusInQuery,
        supportValidator.isValidQueryInviteStatus
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
 * @return {SupportResponse} - the updated support
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the support relationship does not exist
 * @throws {400} - If the permission level is not provided
 * @throws {400} - If the permission level is not a valid option
 */
router.patch(
    '/supporter/:username?',
    [
        userValidator.isUserLoggedIn,
        supportValidator.isSupportBySupporterExists,
        supportValidator.isPermissionInBody,
        supportValidator.isValidUpdatePermission,
    ],
    async (req: Request, res: Response) => {
        let support = undefined;
  
        const supporting = (req.session.userId as string) ?? '';
        const supporter = await UserCollection.findOneByUsername(req.params.username);
        if (req.body.permission){
            support = await SupportCollection.updateOnePermission(supporting, supporter._id, req.body.permission);
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
 * @name PATCH /api/supports/supporting/:username
 *
 * @return {SupportResponse} - the updated support object
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the support relationship does not exist
 * @throws {400} - If the permission level is not provided
 * @throws {400} - If the permission level is not a valid option
 */
router.patch(
    '/supporting/:username?',
    [
        userValidator.isUserLoggedIn,
        supportValidator.isSupportBySupportingExists,
        supportValidator.isValidUpdateInviteStatus,
    ],
    async (req: Request, res: Response) => {
        let support = undefined;

        const supporter = (req.session.userId as string) ?? '';
        const supporting = await UserCollection.findOneByUsername(req.params.username);
        if (req.body.inviteStatus){
            support = await SupportCollection.updateOneInviteStatus(supporting._id, supporter, req.body.inviteStatus);
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