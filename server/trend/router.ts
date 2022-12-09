import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import SupportCollection from './collection';
import EntryCollection from './collection';
import TrendCollection from './collection';
import * as userValidator from '../user/middleware';
import * as supportValidator from '../support/middleware'
import * as util from '../entry/util';

const router = express.Router();

/**
 * Get all the trends based on the logged in user's entries
 *
 * @name GET /api/trends
 *
 * @return {EntryResponse[]} - An array of entries owner by user with id
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
 router.get(
    '/',
    [
        userValidator.isUserLoggedIn,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const trendItems = await TrendCollection.findAllTrends(userId);
        const response = trendItems;
        res.status(200).json(response);
    }
);

export {router as trendRouter};