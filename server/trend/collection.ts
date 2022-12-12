import type {HydratedDocument, Types} from 'mongoose';
import { entryRouter } from 'server/entry/router';
import EntryCollection from '../entry/collection';

type trendItem = {
    field: string,
    display: string,
    value: number | Array<trendItem>,
    changeAmt?: string,
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
        const allEntries = await EntryCollection.findAllByOwner(owner);
        const now = new Date();

        const trendItems = []
        trendItems.push({field: 'totalEntries', display:'Total Entries', value: allEntries.length});
        let avgSymptoms = 0;
        let avgMedications = 0;
        let avgMood = 0;
        let maxSymptoms = 0;
        let maxMedications = 0;
        for (const entry of allEntries){
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
        avgMood = allEntries.length > 0 ? Number((avgMood/allEntries.length).toFixed(3)) : 0;
        avgSymptoms = allEntries.length > 0 ? Number((avgSymptoms/allEntries.length).toFixed(3)) : 0;
        avgMedications = allEntries.length > 0 ? Number((avgMedications/allEntries.length).toFixed(3)) : 0;
        trendItems.push({field: 'avgMood', display:'Average Mood (out of 5)', value: avgMood});
        trendItems.push({field: 'perSymptom', display: 'Symptoms in an Entry', value: 
            [{field: 'avgSymptoms', display: 'Average', value: avgSymptoms},
            {field: 'maxSymptoms', display: 'Most', value: maxSymptoms}]})
        trendItems.push({field: 'perSymptom', display: 'Medications in an Entry', value: 
            [{field: 'avgMedications', display: 'Average', value: avgMedications},
            {field: 'maxMedications', display: 'Most', value: maxMedications}]})
        return trendItems
    }

    static async findAllByOwnerAndDaysAgo(owner: Types.ObjectId | string, numDaysAgo: number): Promise<Array<trendItem>>{
        const allEntries = await EntryCollection.findAllByOwner(owner);
        const now = new Date();
        const daysAgo = new Date(now.getTime() - (60*60*24*numDaysAgo*1000));
        const pastDaysAgo = new Date(now.getTime() - (60*60*24*numDaysAgo*2*1000));
        const trendEntries = allEntries.filter((entry) => entry.dateStarted >= daysAgo);
        const pastTrendEntries = allEntries.filter((entry) => entry.dateStarted >= pastDaysAgo && entry.dateStarted < daysAgo);

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
        
        let pastAvgMood = 0;
        let pastAvgSymptoms = 0;
        let pastAvgMedications = 0;
        let pastMaxSymptoms = 0;
        let pastMaxMedications = 0;
        for (const entry of pastTrendEntries){
            pastAvgSymptoms += entry.symptoms.length;
            pastAvgMedications += entry.medications.length;
            pastAvgMood += entry.mood as number;
            if (entry.symptoms.length > maxSymptoms){
                pastMaxSymptoms = entry.symptoms.length;
            }
            if (entry.medications.length > maxMedications){
                pastMaxMedications = entry.medications.length;
            }
        }
        pastAvgMood = trendEntries.length > 0 ? Number((avgMood/trendEntries.length).toFixed(3)) : 0;
        pastAvgSymptoms = trendEntries.length > 0 ? Number((avgSymptoms/trendEntries.length).toFixed(3)) : 0;
        pastAvgMedications = trendEntries.length > 0 ? Number((avgMedications/trendEntries.length).toFixed(3)) : 0;

        const avgMoodChange = Number((avgMood - pastAvgMood).toFixed(3));
        const avgSymptomChange = Number((avgSymptoms - pastAvgSymptoms).toFixed(3));
        const maxSymptomChange = Number((maxSymptoms - pastMaxSymptoms).toFixed(3));
        const avgMedicationChange = Number((avgMedications - pastAvgMedications).toFixed(3));
        const maxMedicationChange = Number((maxMedications - pastMaxMedications).toFixed(3));

        trendItems.push({field: 'avgMood', display:'Average Mood (out of 5)', value: avgMood, changeAmt: (avgMoodChange <= 0 ? String(avgMoodChange) : '+' + String(avgMoodChange))});
        trendItems.push({field: 'perSymptom', display: 'Symptoms in an Entry', value: 
            [{field: 'avgSymptoms', display: 'Average', value: avgSymptoms, changeAmt: (avgSymptomChange <= 0 ? String(avgSymptomChange) : '+' + String(avgSymptomChange))},
            {field: 'maxSymptoms', display: 'Most', value: maxSymptoms, changeAmt: (maxSymptomChange <= 0 ? String(maxSymptomChange) : '+' + String(maxSymptomChange))}]})
        trendItems.push({field: 'perSymptom', display: 'Medications in an Entry', value: 
            [{field: 'avgMedications', display: 'Average', value: avgMedications, changeAmt: (avgMedicationChange <= 0 ? String(avgMedicationChange) : '+' + String(avgMedicationChange))},
            {field: 'maxMedications', display: 'Most', value: maxMedications, changeAmt: (maxMedicationChange <= 0 ? String(maxMedicationChange) : '+' + String(maxMedicationChange))}]})


        return trendItems
    }
}

export default TrendCollection;