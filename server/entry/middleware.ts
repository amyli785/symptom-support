import type {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import UserCollection from '../user/collection';
import SupportCollection from '../support/collection';
import EntryCollection from './collection';
import * as symptomUtil from '../symptom/util';
import * as medicationUtil from '../medication/util';

/**
 * Checks if the current session user has view permissions to the req.query.username user.
 */
const isUsernameViewable = async (req: Request, res: Response, next: NextFunction) => {
  const supported = await UserCollection.findOneByUsername(req.query.username as string);
  const canView = await SupportCollection.canView(supported._id, req.session.userId as string);

  if (!canView) {
    res.status(403).json({
      error: `The user lacks permissions to view entries about the user with username ${req.query.username}.`,
    });
    return;
  }

  next();
};

/**
 * Checks if an entry exists with id req.params.entryId.
 */
const isEntryIdExists = async (req: Request, res: Response, next: NextFunction) => {
  const entryId = req.params.entryId as string;
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
 * Checks if the current session user has view permissions to req.params.entryId.
 */
const isEntryIdViewable = async (req: Request, res: Response, next: NextFunction) => {
  const entry = await EntryCollection.findOneByEntryId(req.params.entryId as string);
  const canView = await SupportCollection.canView(entry.owner._id, req.session.userId as string);

  if (!canView) {
    res.status(403).json({
      error: `The user lacks permissions to view the entry with id ${req.params.entryId}.`,
    });
    return;
  }

  next();
};

/**
 * Checks if the current session user has manage permissions to req.params.entryId.
 */
const isEntryIdManageable = async (req: Request, res: Response, next: NextFunction) => {
  const entry = await EntryCollection.findOneByEntryId(req.params.entryId as string);
  const canManage = await SupportCollection.canManage(entry.owner._id, req.session.userId as string);

  if (!canManage) {
    res.status(403).json({
      error: `The user lacks permissions to modify, delete, or manage the entry with id ${req.params.entryId}.`,
    });
    return;
  }

  next();
};

/**
 * Checks if the username req.body.owner is non-empty and exists.
 */
const isOwnerExists = async (req: Request, res: Response, next: NextFunction) => {
  const ownerUsername = req.body.owner as string;
  if (!ownerUsername) {
    res.status(400).json({
      error: 'Provided owner username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByUsername(ownerUsername);
  if (!user) {
    res.status(404).json({
      error: `An owner user with username ${ownerUsername as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the current session user has create permissions to the username req.body.owner.
 */
const isOwnerCreateable = async (req: Request, res: Response, next: NextFunction) => {
  const supported = await UserCollection.findOneByUsername(req.body.owner as string);
  const canCreate = await SupportCollection.canCreate(supported._id, req.session.userId as string);

  if (!canCreate) {
    res.status(403).json({
      error: `The user lacks permissions to create an entry for the user with username ${req.body.owner as string}.`,
    });
    return;
  }

  next();
};

/**
 * Checks if req.body.dateStarted is nonempty and a valid date in the correct format
 */
const isDateStartedValid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dateStarted = req.body.dateStarted as string;
    if (!dateStarted) {
      throw new Error('Provided date started must be nonempty.');
    }

    const obj = new Date(dateStarted);
    if (obj.toString() === 'Invalid Date') {
      throw new Error('Provided date started not in valid date format.');
    }
  } catch (e) {
    res.status(400).json({
      error: (e as Error).message,
    });
    return;
  }
  
  next();
};

/**
 * Checks that if req.body.dateEnded is nonempty, it is a valid date in the correct format
 */
const isDateEndedValid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dateEnded = req.body.dateEnded as string;
    if (!dateEnded) {
      next();
      return;
    }

    const obj = new Date(dateEnded);
    if (obj.toString() === 'Invalid Date') {
      throw new Error('Provided date ended not in valid date format.');
    }
  } catch (e) {
    res.status(400).json({
      error: (e as Error).message,
    });
    return;
  }
  
  next();
};

/**
 * Checks that req.body.symptoms is an array and each element of the array is in the correct format.
 */
const isSymptomsValid = async (req: Request, res: Response, next: NextFunction) => {
  const symptoms = req.body.symptoms;

  if (!Array.isArray(symptoms)) {
    res.status(400).json({
      error: 'Provided symptoms must be an array.',
    });
    return;
  }

  const symptomsValid = symptoms.every(symptom => {
    if (!symptomUtil.isValidSymptomName(symptom.name)) {
      return false;
    }

    const intensity = Number(symptom.intensity);
    if (intensity === NaN) {
      return false;
    }

    if (!symptomUtil.isValidIntensity(intensity)) {
      return false;
    }

    return true;
  });

  if (!symptomsValid) {
    res.status(400).json({
      error: 'Provided symptoms must each include a name and integer intensity between 1 and 10, inclusive.'
    });
    return;
  }

  next();
};

/**
 * Checks that req.body.medications is an array and each element of the array is in the correct format.
 */
const isMedicationsValid = async (req: Request, res: Response, next: NextFunction) => {
  const medications = req.body.medications;

  if (!Array.isArray(medications)) {
    res.status(400).json({
      error: 'Provided medications must be an array.',
    });
    return;
  }

  const medicationsValid = medications.every(medication => {
    if (!medicationUtil.isValidMedicationName(medication.name)) {
      return false;
    }

    const dosage = Number(medication.dosage);
    if (dosage === NaN) {
      return false;
    }

    if (!medicationUtil.isValidDosage(dosage)) {
      return false;
    }

    return true;
  });

  if (!medicationsValid) {
    res.status(400).json({
      error: 'Provided medications must each include a name and dosage greater than 0.'
    });
    return;
  }

  next();
};

/**
 * Checks that if req.body.mood is nonempty, it is an integer between 1 and 10, inclusive
 */
const isMoodValid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const moodString = req.body.mood as String;
    if (!moodString) {
      next();
      return;
    }

    const mood = Number(moodString);
    if (mood === NaN) {
      throw new Error('Provided mood must be a number.');
    }

    if (!Number.isInteger(mood)) {
      throw new Error('Provided mood must be an integer.');
    }

    if (mood < 1 || mood > 10) {
      throw new Error('Provided mood must be between 1 and 10, inclusive.')
    }
  } catch (e) {
    res.status(400).json({
      error: (e as Error).message,
    });
    return;
  }
  
  next();
};

export {
  isUsernameViewable,
  isEntryIdExists,
  isEntryIdViewable,
  isEntryIdManageable,
  isOwnerExists,
  isOwnerCreateable,
  isDateStartedValid,
  isDateEndedValid,
  isSymptomsValid,
  isMedicationsValid,
  isMoodValid,
};
