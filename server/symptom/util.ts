function isValidSymptomName(name: string): Boolean {
    return name.length !== 0;
}

function isValidIntensity(intensity: number): Boolean {
    return intensity <= 10 && intensity >= 1;
}
