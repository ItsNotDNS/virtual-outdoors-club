export function capitalizeFirstLetter(string) {
    if (string) {
        const returnString = string.toLowerCase();
        return returnString.charAt(0).toUpperCase() + returnString.slice(1);
    }
    return null;
}
