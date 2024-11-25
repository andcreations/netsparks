/** */
export function deleteMatchingFromArray<T>(
  array: T[],
  predicate: Parameters<Array<T>['find']>[0],
): T[] {
  let newArray: T[] = [...array];
  while (true) {
    const index = newArray.findIndex(predicate);
    if (index < 0) {
      break;
    }
    newArray = [
      ...newArray.slice(0, index),
      ...newArray.slice(index + 1),
    ];
  }
  return newArray;
}