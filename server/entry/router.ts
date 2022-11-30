import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import EntryCollection from './collection';
import SymptomCollection from '../symptom/collection';
import MedicationCollection from '../medication/collection';
import * as userValidator from '../user/middleware';
import * as entryValidator from './middleware';
import * as util from './util';

const router = express.Router();

export type SymptomDetails = {
  name: string,
  intensity: number,
  location: string,
};

export type MedicationDetails = {
  name: string,
  dosage: number,
};

/**
 * Get all entries owned by the username.
 *
 * @name GET /api/entries?username=username
 *
 * @return {EntryResponse[]} - An array of entries where owner = username
 * @throws {403} - If user not logged in
 * @throws {400} - If `username` is empty
 * @throws {404} - If no user with `username` exists
 * @throws {403} - If user lacks permissions to view entries about the user with username `username`
 */
 router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserInQueryExists,
    entryValidator.isUsernameViewable,
  ],
  async (req:Request, res:Response, next: NextFunction) => {
    const user = await UserCollection.findOneByUsername(req.query.username as string);

    const entries = await EntryCollection.findAllByOwner(user._id);
    const response = entries.map(util.constructEntryResponse);
    res.status(200).json(response);
  },
);

/**
 * Get the entry with the entry id.
 *
 * @name GET /api/entries/:entryId
 *
 * @return {EntryResponse} - The entry with entryId, if any
 * @throws {403} - If user not logged in
 * @throws {400} - If `entryId` is empty or not in the correct format
 * @throws {404} - If no entry with `entryId` exists
 * @throws {403} - If user lacks permissions to view entry with id `entryId`
 */
 router.get(
  '/:entryId?',
  [
    userValidator.isUserLoggedIn,
    entryValidator.isEntryIdExists,
    entryValidator.isEntryIdViewable,
  ],
  async (req:Request, res:Response, next: NextFunction) => {
    const entry = await EntryCollection.findOneByEntryId(req.params.entryId as string);
    const response = util.constructEntryResponse(entry);
    res.status(200).json(response);
  },
);

/**
 * Add a new entry with author as the logged in user.
 *
 * @name POST /api/entries
 * 
 * @param {string} owner - The username of the owner of the entry
 * @param {string} dateStarted - The date started of the content of the entry
 * @param {string} dateEnded - The date ended of the content of the entry
 * @param {Array<SymptomDetails>} symptoms - The symptoms of the entry
 * @param {Array<MedicationDetails>} medications - The medications of the entry
 * @param {number} mood - The mood of the entry
 * @param {string} notes - The notes of the entry
 * @return {EntryResponse} - The created Entry
 * @throws {403} - If the user is not logged in
 * @throws {400} - If `owner` is empty
 * @throws {404} - If no user with username `owner` exists
 * @throws {403} - If user lacks permissions to create an entry for user with username `owner`
 * @throws {400} - If `dateStarted` is empty or not a valid date or in the past
 * @throws {400} - If `dateEnded` is non-empty and not a valid date or in the past or before `dateStarted`
 * @throws {400} - If `symptoms` is not an array or contains an element that is not properly formatted (non-empty name, integer intensity between 1 and 10, inclusive)
 * @throws {400} - If `medications` is not an array or contains an element that is not properly formatted (non-empty name, number dosage greater than 0)
 * @throws {400} - If `mood` is non-empty and not in the correct format (integer between 1 and 10, inclusive)
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    entryValidator.isOwnerExists,
    entryValidator.isOwnerCreateable,
    entryValidator.isDateStartedValid,
    entryValidator.isDateEndedValid,
    entryValidator.isSymptomsValid,
    entryValidator.isMedicationsValid,
    entryValidator.isMoodValid,
  ],
  async (req: Request, res: Response) => {
    const owner = await UserCollection.findOneByUsername(req.body.owner as string);
    const authorId = (req.session.userId as string) ?? '';
    
    const dateStarted = new Date(req.body.dateStarted as string);
    const dateEnded = req.body.dateEnded ? new Date(req.body.dateEnded as string) : undefined;

    const symptoms = await Promise.all(req.body.symptoms.map((symptomDetails: SymptomDetails) => 
      SymptomCollection.addOne(symptomDetails.name as string, Number(symptomDetails.intensity), symptomDetails.location as string)
    ));
    const medications = await Promise.all(req.body.medications.map((medicationDetails: MedicationDetails) => 
      MedicationCollection.addOne(medicationDetails.name as string, Number(medicationDetails.dosage))
    ));

    const mood = req.body.mood ? Number(req.body.mood) : undefined;
    const notes = (req.body.notes as string) ?? undefined;

    const entry = await EntryCollection.addOne(
      owner._id,
      authorId,
      dateStarted,
      dateEnded,
      symptoms.map(symptom => symptom._id),
      medications.map(medication => medication._id),
      mood,
      notes,
    );

    res.status(201).json({
      message: `You added a new entry for ${req.body.owner as string} successfully.`,
      entry: util.constructEntryResponse(entry)
    });
  }
);

/**
 * Update an entry with id `entryId`.
 *
 * @name PATCH /api/entries/:entryId
 *
 * @param {string} dateStarted - The date started of the content of the entry
 * @param {string} dateEnded - The date ended of the content of the entry
 * @param {Array<SymptomDetails>} symptoms - The symptoms of the entry
 * @param {Array<MedicationDetails>} medications - The medications of the entry
 * @param {number} mood - The mood of the entry
 * @param {string} notes - The notes of the entry
 * @return {EntryResponse} - The updated entry
 * @throws {403} - If the user is not logged in
 * @throws {400} - If `entryId` is empty or not in the correct format
 * @throws {404} - If no entry with `entryId` exists
 * @throws {403} - If user lacks permissions to manage entry with id `entryId`
 * @throws {400} - If `dateStarted` is empty or not a valid date or in the past
 * @throws {400} - If `dateEnded` is non-empty and not a valid date or in the past or before `dateStarted`
 * @throws {400} - If `symptoms` is not an array or contains an element that is not properly formatted (non-empty name, integer intensity between 1 and 10, inclusive)
 * @throws {400} - If `medications` is not an array or contains an element that is not properly formatted (non-empty name, number dosage greater than 0)
 * @throws {400} - If `mood` is non-empty and not in the correct format (integer between 1 and 10, inclusive)
 */
router.patch(
  '/:entryId?',
  [
    userValidator.isUserLoggedIn,
    entryValidator.isEntryIdExists,
    entryValidator.isEntryIdManageable,
    entryValidator.isSymptomsValid,
    entryValidator.isMedicationsValid,
    entryValidator.isMoodValid,
  ],
  async (req: Request, res: Response) => {
    const entry = await EntryCollection.findOneByEntryId(req.params.entryId as string);

    const dateStarted = new Date(req.body.dateStarted as string);
    const dateEnded = req.body.dateEnded ? new Date(req.body.dateEnded as string) : undefined;

    await Promise.all([
      Promise.all(entry.symptoms.map(symptom => SymptomCollection.deleteOne(symptom))),
      Promise.all(entry.medications.map(medication => MedicationCollection.deleteOne(medication))),
    ]);
    const symptoms = await Promise.all(req.body.symptoms.map((symptomDetails: SymptomDetails) => 
      SymptomCollection.addOne(symptomDetails.name as string, Number(symptomDetails.intensity), symptomDetails.location as string)
    ));
    const medications = await Promise.all(req.body.medications.map((medicationDetails: MedicationDetails) => 
      MedicationCollection.addOne(medicationDetails.name as string, Number(medicationDetails.dosage))
    ));

    const mood = req.body.mood ? Number(req.body.mood) : undefined;
    const notes = (req.body.notes as string) ?? undefined;

    const entryUpdated = await EntryCollection.updateOne(
      entry._id,
      dateStarted,
      dateEnded,
      symptoms.map(symptom => symptom._id),
      medications.map(medication => medication._id),
      mood,
      notes,
    );

    res.status(200).json({
      message: 'Your entry was updated successfully.',
      entry: util.constructEntryResponse(entryUpdated)
    });
  }
);

/**
 * Delete the entry with given entry id.
 *
 * @name DELETE /api/entries/:entryId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If `entryId` is empty or not in the correct format
 * @throws {404} - If no entry with `entryId` exists
 * @throws {403} - If user lacks permissions to manage entry with id `entryId`
 */
router.delete(
  '/:entryId?',
  [
    userValidator.isUserLoggedIn,
    entryValidator.isEntryIdExists,
    entryValidator.isEntryIdManageable,
  ],
  async (req: Request, res: Response) => {
    const entry = await EntryCollection.deleteOne(req.params.entryId as string);

    res.status(200).json({
      message: `You removed the entry ${req.params.entryId} successfully.`,
    });
  }
);

export {router as entryRouter};