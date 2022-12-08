import type {HydratedDocument, Types} from 'mongoose';
import EntryCollection from '../entry/collection';

type trendItem = {
    field: string,
    display: string,
    value: number,
  };

class TrendCollection{
    static async findAllByOwner(owner: Types.ObjectId | string): Promise<Array<trendItem>>{
        // get all the entries for the last week
        const allEntries = await EntryCollection.findAllByOwner(owner);
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - (60*60*24*7*1000));
        // old < new
        const trendEntries = allEntries.filter(function(entry) {
            return entry.dateStarted >= oneWeekAgo;
        })
        const trendItems = []
        trendItems.push({field: 'allTimeTotalEntries', display:'Total Entries', value: allEntries.length});
        trendItems.push({field: 'weeklyTotalEntries', display:'Number of Entries in the Last 7 Days', value: trendEntries.length});
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
        trendItems.push({field: 'weeklyAvgSymptoms', display: 'Average Symptoms per Entry', value: totalSymptoms/trendEntries.length});
        trendItems.push({field: 'weeklyAvgMedications', display: 'Average Medications per Entry', value: totalMedications/trendEntries.length});
        trendItems.push({field: 'weeklyMaxSymptoms', display: 'Max Symptoms per Entry', value: maxSymptoms});
        trendItems.push({field: 'weeklyMaxMedications', display: 'Max Medications per Entry', value: maxMedications});
        trendItems.push({field: 'weeklyAvgMood', display:'Average Mood over the Week', value: totalMood/trendEntries.length});
        return trendItems

        // max number of symptoms in any entry
    }
}

export default TrendCollection;