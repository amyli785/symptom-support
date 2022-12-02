import type { HydratedDocument , Types } from 'mongoose';
import mongoose from 'mongoose';
import type { Entry } from './model';
import EntryModel from './model';

class EntryCollection {
  /**
   * Add a new entry.
   * 
   * @param {string} owner - The id of the owner of the entry
   * @param {string} author - The id of the author of the entry
   * @param {Date} dateStarted - The date started of the content of the entry
   * @param {Date} dateEnded - The date ended of the content of the entry
   * @param {Array<string>} symptoms - The ids of the symptoms of the entry
   * @param {Array<string>} medications - The ids of the medications of the entry
   * @param {number} mood - The mood of the entry
   * @param {string} notes - The notes of the entry
   * @return {Promise<HydratedDocument<Entry>>} - The newly created entry
   */
  static async addOne(
    owner: Types.ObjectId | string,
    author: Types.ObjectId | string,
    dateStarted: Date,
    dateEnded: Date | undefined,
    symptoms: (Types.ObjectId | string)[],
    medications: (Types.ObjectId | string)[],
    mood: number | undefined,
    notes: string | undefined,
  ): Promise<HydratedDocument<Entry>> {
    const entry = new EntryModel({
      owner,
      author,
      dateStarted,
      dateEnded,
      symptoms,
      medications,
      mood,
      notes,
    });
    await entry.save();
    return entry.populate(['owner', 'author', 'symptoms', 'medications']);
  }

  /**
   * Find an entry by entryId
   * 
   * @param {string} entryId - The entryId of the entry to find
   * @return {Promise<HydratedDocument<Entry>> | Promise<null>} - The entry with the given id, if any
   */
  static async findOneByEntryId(entryId: Types.ObjectId | string): Promise<HydratedDocument<Entry>> {
    const entry = await EntryModel.findOne({_id: entryId});
    console.log(entry);
    return entry.populate(['owner', 'author', 'symptoms', 'medications']);
  }

  /**
   * Find all entries by entryIds
   * 
   * @param {string[]} entryIds - The entryIds of the entries to find
   * @return {Promise<HydratedDocument<Entry>[]>} - The entries with the given ids
   */
  static async findAllByEntryIds(entryIds: (Types.ObjectId | string)[]): Promise<Array<HydratedDocument<Entry>>> {
    const entries = await Promise.all(entryIds.map(async (entryId) => {
      const entry = await EntryModel.findOne({_id: entryId});
      return entry.populate(['owner', 'author', 'symptoms', 'medications']);
    }));
    return entries;
  }

  /**
   * Find all entries where the user id is the owner
   * 
   * @param {string} ownerId - The user id of the owner of the entries to find
   * @return {Promise<HydratedDocument<Entry>[]>} - The entries with the given owner id
   */
  static async findAllByOwner(ownerId: Types.ObjectId | string): Promise<Array<HydratedDocument<Entry>>> {
    return EntryModel.find({owner: ownerId}).sort({dateStarted: -1}).populate(['owner', 'author', 'symptoms', 'medications']);
  }

  /**
   * Update an entry.
   * 
   * @param {Date} dateStarted - The date started of the content of the entry
   * @param {Date} dateEnded - The date ended of the content of the entry
   * @param {Array<string>} symptoms - The ids of the symptoms of the entry
   * @param {Array<string>} medications - The ids of the medications of the entry
   * @param {number} mood - The mood of the entry
   * @param {string} notes - The notes of the entry
   * @return {Promise<HydratedDocument<Entry>>} - The updated entry
   */
    static async updateOne(
    entryId: Types.ObjectId | string,
    dateStarted: Date,
    dateEnded: Date | undefined,
    symptoms: (Types.ObjectId | string)[],
    medications: (Types.ObjectId | string)[],
    mood: Number | undefined,
    notes: string | undefined,
  ): Promise<HydratedDocument<Entry>>{
    const entry = await EntryModel.findOne({_id: entryId});
    entry.dateStarted = dateStarted;
    entry.dateEnded = dateEnded;
    entry.symptoms = symptoms.map(symptomId => new mongoose.Types.ObjectId(symptomId));
    entry.medications = medications.map(medicationId => new mongoose.Types.ObjectId(medicationId));
    entry.mood = mood;
    entry.notes = notes;
    await entry.save();
    return entry.populate(['owner', 'author', 'symptoms', 'medications']);
  }

  /**
   * Delete an entry from the collection. 
   * 
   * @param {string} entryId - The entryId of the entry to delete
   * @return {Promise<Boolean>} - true if the entry has been deleted, false otherwise
   */
  static async deleteOne(entryId: Types.ObjectId | string): Promise<boolean>{
    const entry = await EntryModel.deleteOne({_id: entryId});
    return entry !== null;
  }
}

export default EntryCollection;