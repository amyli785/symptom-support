import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import SupportCollection from '../support/collection'


/**
 * Checks if a Support with userId as supporting and username in req.body as supporter exists
 */
 const isSupportAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const supporter = await UserCollection.findOneByUsername(req.body.username);

    const support = await SupportCollection.findOne(userId, supporter._id);

    if (!support){
        next();
        return;
    }

    res.status(409).json({
        error: `The support relation already exists.`
    });
    return;
};

/**
 * Checks if a Support with userId as supporting and username in req.params as supporter does not exist
 */
const isSupportDoesNotExist = async(req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const supporter = await UserCollection.findOneByUsername(req.params.username);
    const support = await SupportCollection.findOne(userId, supporter._id);

    if (!support){
        res.status(404).json({
            error: {
                supportNotFound: `Support relation does not exist.`
            }
        });
        return;
    }
    next();
};

/**
 * Checks if a support with userId as supporter and username in req.params as supporting does not exist
 */
const isSupportingDoesNotExist = async(req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const supporting = await UserCollection.findOneByUsername(req.params.username);
    const support = await SupportCollection.findOne(supporting._id,userId);

    if (!support){
        res.status(404).json({
            error: {
                supportNotFound: `Support relation does not exist.`
            }
        });
        return;
    }
    next();
};

/**
 * Checks if a support relationship does not exist between userId who is logged in and
 * username from req.body
 */
const isSupportRelationDoesNotExist = async(req: Request, res:Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const userFromBody = await UserCollection.findOneByUsername(req.body.username);
    const userAsSupporter = await SupportCollection.findOne(userFromBody._id,userId);
    const userAsSupporting = await SupportCollection.findOne(userId, userFromBody._id);

    if (!userAsSupporter){
        if (!userAsSupporting){
            res.status(404).json({
                error:{
                    supportNotFound: `No support relation exists with ${req.body.username}`
                }
            });
            return;
        }
    }
    next();
}

/**
 * Checks if a permission is provided in req.body
 */
const isPermissionInBody = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.permission) {
      res.status(400).json({
        error: 'Provided permission level must be nonempty.'
      });
      return;
    }
  
    next();
};

/**
 * Checks if a support with supporter is req.params and supporting as logged in user exists
 */
const isSupportBySupporterExists = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const supporter = await UserCollection.findOneByUsername(req.params.username);

    const support = await SupportCollection.findOne(userId, supporter._id);

    if (!support) {
      res.status(404).json({
        error: `Support relationship with ${req.params.username} does not exist.`
      });
      return;
    }
  
    next();
};

/**
 * Checks if a support with supporting is req.params and supporter as logged in user exists
 */
 const isSupportBySupportingExists = async (req: Request, res: Response, next: NextFunction) => {
    const supporter = (req.session.userId as string) ?? '';
    const supporting = await UserCollection.findOneByUsername(req.params.username);

    const support = await SupportCollection.findOne(supporting._id, supporter);

    if (!support) {
      res.status(404).json({
        error: `Support relationship with ${req.params.username} does not exist.`
      });
      return;
    }
  
    next();
};

/**
 * Checks if the permission level is one of "viewer", "creator", or "manager."
 */
const isValidUpdatePermission = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.permission){
        const {permission} = req.body as {permission: string};
        if (!permission.trim()) {
            res.status(400).json({
                error: 'Permission content must be at least one character long.'
            });
            return;
        }
    
        if (!(permission == 'viewer' || permission == 'creator' || permission == 'manager')) {
            res.status(400).json({
                error: 'not a valid permission level'
            });
            return;
        }
    }
    
    next();
};

/**
 * Checks if an inviteStatus is provided in req.body
 */
 const isInviteStatusInBody = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.inviteStatus) {
      res.status(400).json({
        error: 'Provided invite status must be nonempty.'
      });
      return;
    }
  
    next();
};

/**
 * Checks if an inviteStatus is provided in req.query
 */
 const isInviteStatusInQuery = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.inviteStatus) {
      res.status(400).json({
        error: 'Provided invite status must be nonempty.'
      });
      return;
    }
  
    next();
};

/**
 * Checks if the invite status is one of "invited" or "accepted."
 */
 const isValidUpdateInviteStatus = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.inviteStatus){
        const {inviteStatus} = req.body as {inviteStatus: string};
        if (!inviteStatus.trim()) {
            res.status(400).json({
                error: 'Invite Status must be at least one character long.'
            });
            return;
        }
    
        if (!(inviteStatus == 'invited' || inviteStatus == 'accepted')) {
            res.status(400).json({
                error: 'Not a valid invite status'
            });
            return;
        }
    }
    
    next();
};

/**
 * Checks if the invite status is one of "invited" or "accepted."
 */
 const isValidQueryInviteStatus = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.inviteStatus){
        const {inviteStatus} = req.query as {inviteStatus: string};
        if (!inviteStatus.trim()) {
            res.status(400).json({
                error: 'Invite Status must be at least one character long.'
            });
            return;
        }
    
        if (!(inviteStatus == 'invited' || inviteStatus == 'accepted')) {
            res.status(400).json({
                error: 'Not a valid invite status'
            });
            return;
        }
    }
    
    next();
};

export {
    isSupportAlreadyExists,
    isSupportDoesNotExist,
    isSupportingDoesNotExist,
    isSupportRelationDoesNotExist,
    isPermissionInBody,
    isSupportBySupporterExists,
    isSupportBySupportingExists,
    isValidUpdatePermission,
    isInviteStatusInBody,
    isValidUpdateInviteStatus,
    isInviteStatusInQuery,
    isValidQueryInviteStatus
};