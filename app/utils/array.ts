/**
 * Removes the specified item from the array. This mutates the provided array and only removes the first occurence of the item.
 */
export function removeItem<T>(array: T[], itemToRemove: T) {
  const index = array.indexOf(itemToRemove);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

/**
 * Removes the specified item from the array, using the passed function to test for equality.
 * This mutates the provided array and only removes the first occurence of the item.
 */
export function removeItemBy<T>(
  array: T[],
  itemToRemove: T,
  testFun: (a: T, b: T) => boolean,
) {
  const index = array.findIndex((item) => testFun(item, itemToRemove));
  if (index !== -1) {
    array.splice(index, 1);
  }
}
