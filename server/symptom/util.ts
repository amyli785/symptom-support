function isValidSymptomName(name: string): Boolean {
    return name && name.length !== 0;
}

function isValidSymptomUnitMeasurementCombo(measurement: number, unit: string): Boolean {
    if (unit && unit.length !== 0) {
        if (unit === "pain level") {
            return !Number.isNaN(measurement) && measurement <= 10 && measurement >= 1;
        } else if (unit === "deg F" || unit === "deg C" || unit === "kg" || unit == "mL") {
            return measurement && !Number.isNaN(measurement)
        } 
        return false;
    } else {
        if (measurement && !Number.isNaN(measurement)) {
            return false;
        } 
        return true;
    }
}
export {
    isValidSymptomName,
    isValidSymptomUnitMeasurementCombo,
};