/// <reference types="node" />
/// <reference types="node" />
import { Dirent, PathLike } from "fs";
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
export declare class TreeNode {
    name: string;
    path: string;
    isFile: boolean;
    children?: TreeNode[];
    constructor(name: string, path: string, isFile: boolean, children?: TreeNode[]);
}
/**
 * Reads directory `parent` (either recursively or not depending on options) and
 * generates either a `string[]` of unix paths, {@link Dirent[]} array with unix paths
 * property or, when recursive is true, returns a tree also with unix paths for each node.
 * @param parent
 * @param options
 * @returns
 */
export declare function unixreaddir(parent: PathLike, options?: Readdiroptions): Promise<Dirent[] | string[] | TreeNode>;
//# sourceMappingURL=index.d.ts.map