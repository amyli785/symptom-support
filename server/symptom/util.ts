function isValidSymptomName(name: string): Boolean {
    return name && name.length !== 0;
}

function isValidSymptomUnitMeasurementCombo(measurement: number, unit: string): Boolean {
    if (unit && unit.length !== 0) {
        if (unit === "out of 1 - 10") {
            return !Number.isNaN(measurement) && measurement <= 10 && measurement >= 1;
        } else if (unit === "°F" || unit === "°C" || unit === "kg" || unit == "mL" || unit == "pound") {
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