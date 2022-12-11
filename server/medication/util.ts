function isValidMedicationName(name: string): Boolean {
    return name.length !== 0;
}

function isValidDosage(dosage: number): Boolean {
    return dosage > 0;
}

function isValidUnit(unit: string): Boolean {
    return unit === "mg" || unit === "ml";
}

export {
    isValidMedicationName,
    isValidDosage,
    isValidUnit
};