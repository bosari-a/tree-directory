/// <reference types="node" />
/// <reference types="node" />
import { Dirent, PathLike } from "fs";
export type Readdiroptions = {
    encoding?: BufferEncoding | null | undefined;
    withFileTypes?: boolean | undefined;
    recursive?: boolean | undefined;
};
export declare class TreeNode {
    name: string;
    path: string;
    isFile: boolean;
    children?: TreeNode[];
    constructor(name: string, path: string, isFile: boolean, children?: TreeNode[]);
}
/**
 *
 * @param parent
 * @param options
 * @returns
 */
export declare function unixreaddir(parent: PathLike, options?: Readdiroptions): Promise<Dirent[] | string[] | TreeNode>;
//# sourceMappingURL=index.d.ts.map