export function createPairsFromArray<T>(array: T[]): T[][] {
  const pairedArray = [];
  let pairedArrayIndex = 0;
  let arrayIndex = 0;
  while (arrayIndex <= array.length - 2) {
    pairedArray[pairedArrayIndex] = [array[arrayIndex], array[arrayIndex + 1]];
    pairedArrayIndex += 1;
    arrayIndex += 2;
  }
  return pairedArray;
}

export function stringMatchesAnyOf(stringToCheck: string, ...matchers: string[]) {
  let result = false;
  let index = 0;
  while (result === false && index <= matchers.length - 1) {
    if (stringToCheck.includes(matchers[index])) {
      result = true;
    }
    index += 1;
  }
  return result;
}

export function dropFirstChar(string: string): string {
  return string.substring(1);
}
export function dropLastChar(string: string): string {
  return string.substring(0, string.length - 1);
}
