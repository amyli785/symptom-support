import type {Request, Response, NextFunction} from 'express';
// import {Types} from 'mongoose';
import mongoose from 'mongoose';
import UserCollection from '../user/collection';
import SupportCollection from '../support/collection'
import FlagCollection from '../flag/collection'
import EntryCollection from '../entry/collection'

/**
 * Checks if a Flag for entryId in req.body already exists
 */
 const isFlagAlreadyExists = async (req: Request, res: Response, next: NextFunction) => {
    const entryId = (req.body.entryId as string) ?? '';
    const flag = await FlagCollection.findOneByEntryId(entryId);

    if (!flag){
        next();
        return;
    }

    res.status(409).json({
        error: `The flag already exists.`
    });
    return;
};

/**
 * Checks if a Flag for entryId in req.query already exists
 */
 const isFlagInQueryExists = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.entryId !== undefined) {
        const entryId = (req.query.entryId as string) ?? '';
        const flag = await FlagCollection.findOneByEntryId(entryId);

        if (flag){
            next();
            return;
        }

        res.status(403).json({
            error: `The flag does not exist.`
        });
        return;
    }
    else{
        next();
    }
};

/**
 * Checks if an entryId is provided in req.body
 */
 const isEntryIdInBody = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.entryId) {
      res.status(400).json({
        error: 'Provided entryId must be nonempty.'
      });
      return;
    }
  
    next();
};

/**
 * Checks if an entryId is provided in req.body
 */
 const isEntryIdInParams = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.entryId) {
      res.status(400).json({
        error: 'Provided entryId must be nonempty.'
      });
      return;
    }
  
    next();
};

/**
 * Checks if the current session user has view permissions to req.query.username's entries.
 */
 const isUserFlagsViewable = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.username !== undefined){
      const user = await UserCollection.findOneByUsername(req.query.username as string);
      const canView = await SupportCollection.canView(user._id, req.session.userId as string);
  
      if (!canView) {
        res.status(403).json({
          error: `The user lacks permissions to view ${req.query.username}'s entries.`,
        });
        return;
      }
      else{
        next();
      }
  
    }
    else{
        next();
        return;
    }
  };

/**
 * Checks if an entry exists with id req.body.entryId.
 */
const isEntryIdInBodyExists = async (req: Request, res: Response, next: NextFunction) => {
    const entryId = req.body.entryId as string;
    if (!entryId) {
      res.status(400).json({
        error: 'Provided entryId must be nonempty.'
      });
      return;
    }
  
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      res.status(400).json({
        error: 'Provided entryId must be a correctly formatted object id.'
      });
      return;
    }
  
    const entry = await EntryCollection.findOneByEntryId(entryId);
    if (!entry) {
      res.status(404).json({
        error: `An entry with id ${entryId} does not exist.`
      });
      return;
    }
  
    next();
};

/**
 * Checks if an entry exists with id req.query.entryId.
 */
 const isEntryIdInQueryExists = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.entryId !== undefined){
        const entryId = req.query.entryId as string;
        if (!entryId) {
            res.status(400).json({
                error: 'Provided entryId must be nonempty.'
            });
            return;
        }
    
        if (!mongoose.Types.ObjectId.isValid(entryId)) {
            res.status(400).json({
                error: 'Provided entryId must be a correctly formatted object id.'
            });
            return;
        }
    
        const entry = await EntryCollection.findOneByEntryId(entryId);
        if (!entry) {
            res.status(404).json({
                error: `An entry with id ${entryId} does not exist.`
            });
            return;
        }
    
        next();
    }
    else{
        next();
    }
};

/**
 * Checks if the current session user has view permissions to req.query.entryId.
 */
 const isEntryIdQueryViewable = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.entryId !== undefined){
      const entry = await EntryCollection.findOneByEntryId(req.query.entryId as string);
      const canView = await SupportCollection.canView(entry.owner._id, req.session.userId as string);
  
      if (!canView) {
        res.status(403).json({
          error: `The user lacks permissions to view the entry with id ${req.query.entryId}.`,
        });
        return;
      }
  
      next();
    }
    else{
        next();
    }
};  

/**
 * Checks if the current session user has manage permissions to req.body.entryId.
 */
 const isEntryIdCreateable = async (req: Request, res: Response, next: NextFunction) => {
    const entry = await EntryCollection.findOneByEntryId(req.body.entryId as string);
    const canCreate = await SupportCollection.canCreate(entry.owner._id, req.session.userId as string);
  
    if (!canCreate) {
      res.status(403).json({
        error: `The user lacks permissions to create the entry with id ${req.body.entryId}.`,
      });
      return;
    }
  
    next();
  };

/**
 * Checks if a user with username in req.query exists
 */
 const isUserInQueryExists = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.username !== undefined) {
        const user = await UserCollection.findOneByUsername(req.query.username as string);
        if (!user) {
            res.status(404).json({
                error: `A user with username ${req.query.username as string} does not exist.`
        });
        return;
        }
    
        next();
    }
    else{
        next();
    }
};

const isValidQueryProvided = async(req: Request, res: Response, next: NextFunction) => {
    if (!req.query.username && !req.query.entryId){
        res.status(400).json({
            error: `Valid query not provided`
        });
        return;
    }
    next();
}

export{
    isFlagAlreadyExists,
    isEntryIdInBody,
    isFlagInQueryExists,
    isEntryIdInParams,
    isUserFlagsViewable,
    isEntryIdInBodyExists,
    isEntryIdQueryViewable,
    isEntryIdCreateable,
    isEntryIdInQueryExists,
    isUserInQueryExists,
    isValidQueryProvided,
}