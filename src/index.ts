import { Dirent, PathLike } from "fs";
import { readdir, stat } from "fs/promises";
import { normalize, basename, dirname, join } from "path/posix";
/**
 * Type similar to {@link readdir} options argument types.
 */
export type Readdiroptions = {
  encoding?: BufferEncoding | null | undefined;
  withFileTypes?: boolean | undefined;
  recursive?: boolean | undefined;
};
/**
 * Tree node class if option `recursive` is `true`
 */
export class TreeNode {
  name: string;
  path: string;
  isFile: boolean;
  children?: TreeNode[];
  constructor(
    name: string,
    path: string,
    isFile: boolean,
    children?: TreeNode[]
  ) {
    this.name = name;
    this.path = path;
    this.isFile = isFile;
    this.children = children;
  }
}
/**
 * Reads directory `parent` (either recursively or not depending on options) and
 * generates either a `string[]` of unix paths, {@link Dirent[]} array with unix paths
 * property or, when recursive is true, returns a tree also with unix paths for each node.
 * @param parent
 * @param options
 * @returns
 */
export async function unixreaddir(
  parent: PathLike,
  options?: Readdiroptions
): Promise<Dirent[] | string[] | TreeNode> {
  const path = normalize(parent.toString().replace(/\\/g, "/"));
  return new Promise((resolve, reject) => {
    if (options?.withFileTypes || options?.recursive) {
      if (!options.recursive)
        readdir(path, {
          encoding: options.encoding,
          withFileTypes: true,
        })
          .then((values) =>
            resolve(
              values.map((dirent) => {
                dirent.path = normalize(dirent.path.replace(/\\/g, "/"));
                return dirent;
              })
            )
          )
          .catch((err) => {
            reject(err.message || err);
          });
      else {
        stat(path)
          .then((stats) => {
            const tree = new TreeNode(
              basename(path),
              dirname(path),
              stats.isFile(),
              stats.isFile() ? undefined : []
            );
            readdirtree(tree)
              .then(() => {
                resolve(tree);
              })
              .catch((err) => {
                reject(err.message);
              });
          })
          .catch((err) => {
            reject(err.message || err);
          });
      }
    } else if (!options?.recursive && !options?.withFileTypes) {
      readdir(path, { encoding: options?.encoding })
        .then((paths) =>
          resolve(paths.map((path) => normalize(path.replace(/\\/g, "/"))))
        )
        .catch((err) => {
          reject(err.message || err);
        });
    }
  });
}

/**
 * Recursively generates tree.
 *
 * This function is nested just for the sake of isolating state.
 * @param node
 * @returns
 */
export async function readdirtree(node: TreeNode) {
  if (node.isFile || node.children === undefined) {
    return;
  }
  try {
    const children = (await unixreaddir(join(node.path, node.name), {
      withFileTypes: true,
    })) as Dirent[];
    for (let i = 0; i < children.length; i++) {
      const child: Dirent = children[i];
      const childNode = new TreeNode(
        child.name,
        child.path,
        child.isFile(),
        child.isFile() ? undefined : []
      );
      node.children.push(childNode);
      await readdirtree(childNode);
    }
  } catch (err) {
    throw Error(`Error: ${err}`);
  }
}
unixreaddir("parent", { recursive: true }).then((_) =>
  console.dir(_, { depth: null })
);
