import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import SupportCollection from '../support/collection'


/**
 * Checks if a Support with userId as supported and username in req.body as supporter exists
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
 * Checks if a Support with userId as supported and username in req.params as supporter does not exist
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
 * Checks if a support with userId as supporter and username in req.params as supported does not exist
 */
const isSupportedDoesNotExist = async(req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const supported = await UserCollection.findOneByUsername(req.params.username);
    const support = await SupportCollection.findOne(supported._id,userId);

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
    const userAsSupported = await SupportCollection.findOne(userId, userFromBody._id);

    if (!userAsSupporter){
        if (!userAsSupported){
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
 * Checks if a user with username in req.body exists
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
 * Checks if a support with supporter is req.params and supported as logged in user exists
 */
const isSupportExists = async (req: Request, res: Response, next: NextFunction) => {
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

export {
    isSupportAlreadyExists,
    isSupportDoesNotExist,
    isSupportedDoesNotExist,
    isSupportRelationDoesNotExist,
    isPermissionInBody,
    isSupportExists,
    isValidUpdatePermission
};