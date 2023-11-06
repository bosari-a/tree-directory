import { readdir } from "fs/promises";
import { normalize } from "path/posix";

/**
 * Returns a promise with an array of normalized unix paths.
 * @param parent
 * @returns
 */
export async function unixreaddir(parent: string): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    readdir(parent, { recursive: true })
      .then((paths) => {
        resolve(paths.map((path) => normalize(path.replace(/\\/g, "/"))));
      })
      .catch((err) => {
        reject(err.message || err);
      });
  });
}
/**
 * Returns a 2D array containing all 
 * @param paths
 * @returns
 */
export function groupByDirname(paths: string[]): string[][] {
  const parents = paths
    .filter((path) => !path.includes("/"))
    .map((path) => [path]);
  return parents.map((parent) => {
    const regexp = new RegExp(`^${parent[0]}`);
    return paths.filter((path) => path.match(regexp));
  });
}
