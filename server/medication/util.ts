function isValidMedicationName(name: string): Boolean {
    return name.length !== 0;
}

function isValidDosage(dosage: number): Boolean {
    return dosage > 0;
}