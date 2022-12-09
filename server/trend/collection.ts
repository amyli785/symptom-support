import type {HydratedDocument, Types} from 'mongoose';
import EntryCollection from '../entry/collection';

type trendItem = {
    field: string,
    display: string,
    value: number,
};

type trendSubset = {
    allTimeTrends: Array<trendItem>,
    weeklyTrends: Array<trendItem>,
    monthlyTrends: Array<trendItem>
}

class TrendCollection{

    static async findAllTrends(owner: Types.ObjectId | string): Promise<trendSubset>{
        const allTime = await TrendCollection.findAllByOwnerAllTime(owner);
        const weekly = await TrendCollection.findAllByOwnerAndDaysAgo(owner,7);
        const monthly = await TrendCollection.findAllByOwnerAndDaysAgo(owner,30);
        return {allTimeTrends: allTime, weeklyTrends:weekly, monthlyTrends:monthly};
    }

    static async findAllByOwnerAllTime(owner: Types.ObjectId | string): Promise<Array<trendItem>>{
         // get all the entries for the last week
         const allEntries = await EntryCollection.findAllByOwner(owner);
         const now = new Date();
         // old < new
 
         const trendItems = []
         trendItems.push({field: 'totalEntries', display:'Total Entries', value: allEntries.length});
         let totalSymptoms = 0;
         let totalMedications = 0;
         let totalMood = 0;
         let maxSymptoms = 0;
         let maxMedications = 0;
         for (const entry of allEntries){
             totalSymptoms += entry.symptoms.length;
             totalMedications += entry.medications.length;
             totalMood += entry.mood as number;
             if (entry.symptoms.length > maxSymptoms){
                 maxSymptoms = entry.symptoms.length;
             }
             if (entry.medications.length > maxMedications){
                 maxMedications = entry.medications.length;
             }
         }
         trendItems.push({field: 'avgMood', display:'Average Mood', value: Number((totalMood/allEntries.length).toFixed(3))});
         trendItems.push({field: 'avgSymptoms', display: 'Average Number of Symptoms', value: Number((totalSymptoms/allEntries.length).toFixed(3))});
         trendItems.push({field: 'avgMedications', display: 'Average Number of Medications', value: Number((totalMedications/allEntries.length).toFixed(3))});
         trendItems.push({field: 'maxSymptoms', display: 'Greatest Number of Symptoms', value: maxSymptoms});
         trendItems.push({field: 'maxMedications', display: 'Greatest Number of Medications', value: maxMedications});
         return trendItems
    }

    static async findAllByOwnerAndDaysAgo(owner: Types.ObjectId | string, numDaysAgo: number): Promise<Array<trendItem>>{
        // get all the entries for the last week
        const allEntries = await EntryCollection.findAllByOwner(owner);
        const now = new Date();
        const daysAgo = new Date(now.getTime() - (60*60*24*numDaysAgo*1000));
        // old < new
        const trendEntries = allEntries.filter((entry) => entry.dateStarted >= daysAgo);

        const trendItems = []
        trendItems.push({field: 'totalEntries', display:'Total Entries', value: trendEntries.length});
        let totalSymptoms = 0;
        let totalMedications = 0;
        let totalMood = 0;
        let maxSymptoms = 0;
        let maxMedications = 0;
        for (const entry of trendEntries){
            totalSymptoms += entry.symptoms.length;
            totalMedications += entry.medications.length;
            totalMood += entry.mood as number;
            if (entry.symptoms.length > maxSymptoms){
                maxSymptoms = entry.symptoms.length;
            }
            if (entry.medications.length > maxMedications){
                maxMedications = entry.medications.length;
            }
        }
        trendItems.push({field: 'avgMood', display:'Average Mood ', value: Number((totalMood/trendEntries.length).toFixed(3))});
        trendItems.push({field: 'avgSymptoms', display: 'Average Symptoms per Entry', value: Number((totalSymptoms/trendEntries.length).toFixed(3))});
        trendItems.push({field: 'avgMedications', display: 'Average Medications per Entry', value: Number((totalMedications/trendEntries.length).toFixed(3))});
        trendItems.push({field: 'maxSymptoms', display: 'Greatest Number of Symptoms per Entry', value: maxSymptoms});
        trendItems.push({field: 'maxMedications', display: 'Greatest Number of Medications per Entry', value: maxMedications});
        return trendItems
    }
}

export default TrendCollection;