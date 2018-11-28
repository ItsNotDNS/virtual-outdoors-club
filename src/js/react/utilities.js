export function capitalizeFirstLetter(string) {
    const returnString = string.toLowerCase();
    return returnString.charAt(0).toUpperCase() + returnString.slice(1);
}
