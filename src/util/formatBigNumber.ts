/**
 * Formats a number to show a big number in a more readable format
 * For example, 1000 -> 1K, 10000000 -> 10M, 3200000000 -> 3.2B
 * @param num the number to format
 */
export const formatBigNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return Number((num / 1000).toFixed(1)) + "K";
  if (num < 1000000000) return Number((num / 1000000).toFixed(1)) + "M";
  if (num < 1000000000000) return Number((num / 1000000000).toFixed(1)) + "B";
  return Number((num / 1000000000000).toFixed(1)) + "T";
};
