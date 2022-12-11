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
         trendItems.push({field: 'avgSymptoms', display: 'Average Symptoms per Entry', value: Number((totalSymptoms/allEntries.length).toFixed(3))});
         trendItems.push({field: 'avgMedications', display: 'Average Medications per Entry', value: Number((totalMedications/allEntries.length).toFixed(3))});
         trendItems.push({field: 'maxSymptoms', display: 'Most Symptoms in an Entry', value: maxSymptoms});
         trendItems.push({field: 'maxMedications', display: 'Most Medications in an Entry', value: maxMedications});
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
        let avgMood = 0;
        let avgSymptoms = 0;
        let avgMedications = 0;
        let maxSymptoms = 0;
        let maxMedications = 0;
        for (const entry of trendEntries){
            avgSymptoms += entry.symptoms.length;
            avgMedications += entry.medications.length;
            avgMood += entry.mood as number;
            if (entry.symptoms.length > maxSymptoms){
                maxSymptoms = entry.symptoms.length;
            }
            if (entry.medications.length > maxMedications){
                maxMedications = entry.medications.length;
            }
        }
        avgMood = trendEntries.length > 0 ? Number((avgMood/trendEntries.length).toFixed(3)) : 0;
        avgSymptoms = trendEntries.length > 0 ? Number((avgSymptoms/trendEntries.length).toFixed(3)) : 0;
        avgMedications = trendEntries.length > 0 ? Number((avgMedications/trendEntries.length).toFixed(3)) : 0;
        trendItems.push({field: 'avgMood', display:'Average Mood', value: avgMood});
        trendItems.push({field: 'avgSymptoms', display: 'Average Symptoms per Entry', value: avgSymptoms});
        trendItems.push({field: 'avgMedications', display: 'Average Medications per Entry', value: avgMedications});
        trendItems.push({field: 'maxSymptoms', display: 'Most Symptoms in an Entry', value: maxSymptoms});
        trendItems.push({field: 'maxMedications', display: 'Most Medications in an Entry', value: maxMedications});
        return trendItems
    }
}

export default TrendCollection;