/**
 *
 * @param parent
 * @returns
 */
export declare function unixreaddir(parent: string): Promise<string[]>;
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
export declare function dirdata(parent: string, paths: string[]): Promise<IPathData[]>;
/**
 *
 * @param pathData
 * @param paths
 * @returns
 */
export declare function group(pathData: IPathData[], paths: string[]): IPathData[][][];
/**
 *
 * @param parent
 * @returns
 */
export declare function tree(parent: string): Promise<IPathData[][][]>;
//# sourceMappingURL=index.d.ts.map