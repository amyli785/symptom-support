import type {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import ShareCollection from './collection';
import EntryCollection from '../entry/collection';

/**
 * Checks if a share exists with id req.params.shareId.
 */
const isShareIdExists = async (req: Request, res: Response, next: NextFunction) => {
  const shareId = req.params.shareId as string;
  if (!shareId) {
    res.status(400).json({
      error: 'Provided shareId must be nonempty.'
    });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(shareId)) {
    res.status(400).json({
      error: 'Provided shareId must be a correctly formatted object id.'
    });
    return;
  }

  const share = await ShareCollection.findOneByShareId(shareId);
  if (!share) {
    res.status(404).json({
      error: `A share with id ${shareId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks that req.body.entryIds is an array and each element of the array is in the correct format.
 */
 const isEntryIdsValid = async (req: Request, res: Response, next: NextFunction) => {
  const entryIds = req.body.entryIds;

  if (!Array.isArray(entryIds)) {
    res.status(400).json({
      error: 'Provided entryIds must be an array.',
    });
    return;
  }

  const entryIdsValid = entryIds.every(entryId => mongoose.Types.ObjectId.isValid(entryId));

  if (!entryIdsValid) {
    res.status(400).json({
      error: 'Provided entryIds must all be correctly formatted object ids.'
    });
    return;
  }

  next();
};

/**
 * Checks that each of req.body.entryIds exists.
 */
 const isEntryIdsExistAndShareable = async (req: Request, res: Response, next: NextFunction) => {
  const entries = await Promise.all(req.body.entryIds.map(
    async (entryId: string) => 
    await EntryCollection.findOneByEntryId(entryId)));

  const entryIdsExist = entries.every(entry => !!entry);

  if (!entryIdsExist) {
    res.status(400).json({
      error: 'Provided entryIds must all exist.'
    });
    return;
  }

  const entryIdsShareable = entries.every(entry => entry.owner._id.toString() === req.session.userId as string);

  if (!entryIdsShareable) {
    res.status(403).json({
      error: 'Provided entryIds must all be owned by the user.'
    });
    return;
  }

  next();
};

/**
 * Checks if req.body.name is non-empty.
 */
const isNameValid = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.name as string;
  if (!name) {
    res.status(400).json({
      error: 'Provided name must be nonempty.'
    });
    return;
  }
  
  next();
};

export {
  isShareIdExists,
  isEntryIdsValid,
  isEntryIdsExistAndShareable,
  isNameValid,
};
