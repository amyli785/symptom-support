function isValidSymptomName(name: string): Boolean {
    return name.length !== 0;
}

function isValidIntensity(intensity: number): Boolean {
    return Number.isInteger(intensity) && intensity <= 10 && intensity >= 1;
}

export {
    isValidSymptomName,
    isValidIntensity,
};