/**
 * Converts a size in bytes to a human-readable string.
 *
 * @param bytes - The file size in bytes.
 * @param decimals - Number of decimal places to display (default: 2).
 * @returns A formatted string like "1.45 MB", "200 KB", "3.10 GB", etc.
 */
export function formatSize(bytes: number, decimals: number = 2): string {
  if (bytes < 0) return "Invalid size";
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${value} ${units[i]}`;
}
