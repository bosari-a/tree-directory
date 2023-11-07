import { readdir, stat } from "fs/promises";
import { normalize, basename, dirname, join } from "path/posix";
/**
 *
 * @param parent
 * @returns
 */
export async function unixreaddir(parent: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(parent, { recursive: true })
      .then((paths) => {
        resolve(paths.map((path) => normalize(path.replace(/\\/g, "/"))));
      })
      .catch((err) => {
        reject(err.message || err);
      });
  });
}
export interface IPathData {
  basename: string;
  dirname: string;
  isFile: boolean;
}
/**
 *
 * @param parent
 * @param paths
 * @returns
 */
export async function dirdata(
  parent: string,
  paths: string[]
): Promise<IPathData[]> {
  return new Promise((resolve, reject) => {
    const pathDataPromises = paths.map(async (path): Promise<IPathData> => {
      return new Promise((resolve, reject) => {
        stat(join(parent, path))
          .then((stats) => {
            resolve({
              basename: basename(path),
              dirname: dirname(path),
              isFile: stats.isFile(),
            });
          })
          .catch((err) => {
            reject(err.message || err);
          });
      });
    });
    Promise.all(pathDataPromises)
      .then((values) => {
        resolve(values);
      })
      .catch((err) => {
        reject(err.message || err);
      });
  });
}
/**
 *
 * @param pathData
 * @param paths
 * @returns
 */
export function group(pathData: IPathData[], paths: string[]): IPathData[][][] {
  return paths
    .filter((path) => !path.includes("/"))
    .map((parent): IPathData[][] => {
      const regexp = new RegExp(`^${parent}`);
      const family = pathData.filter(
        (data) => data.dirname.match(regexp) || parent === data.basename
      );
      const files = family.filter((data) => data.isFile);
      const dirs = family.filter((data) => !data.isFile);
      return [dirs, files];
    });
}
/**
 *
 * @param parent
 * @returns
 */
export async function tree(parent: string): Promise<IPathData[][][]> {
  return new Promise((resolve, reject) => {
    unixreaddir(parent)
      .then((paths) => {
        dirdata(parent, paths)
          .then((data) => {
            resolve(group(data, paths));
          })
          .catch((err) => {
            reject(err.message || err);
          });
      })
      .catch((err) => {
        reject(err.message || err);
      });
  });
}
