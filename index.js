import { readdir, stat } from 'fs/promises';
import { normalize, basename, dirname, join } from 'path/posix';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Tree node class if option `recursive` is `true`
 */
class TreeNode {
    constructor(name, path, isFile, children) {
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
function unixreaddir(parent, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const path = normalize(parent.toString().replace(/\\/g, "/"));
        return new Promise((resolve, reject) => {
            if ((options === null || options === void 0 ? void 0 : options.withFileTypes) || (options === null || options === void 0 ? void 0 : options.recursive)) {
                if (!options.recursive)
                    readdir(path, {
                        encoding: options.encoding,
                        withFileTypes: true,
                    })
                        .then((values) => resolve(values.map((dirent) => {
                        dirent.path = normalize(dirent.path.replace(/\\/g, "/"));
                        return dirent;
                    })))
                        .catch((err) => {
                        reject(err.message || err);
                    });
                else {
                    stat(path)
                        .then((stats) => {
                        const tree = new TreeNode(basename(path), dirname(path), stats.isFile(), stats.isFile() ? undefined : []);
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
            }
            else if (!(options === null || options === void 0 ? void 0 : options.recursive) && !(options === null || options === void 0 ? void 0 : options.withFileTypes)) {
                readdir(path, { encoding: options === null || options === void 0 ? void 0 : options.encoding })
                    .then((paths) => resolve(paths.map((path) => normalize(path.replace(/\\/g, "/")))))
                    .catch((err) => {
                    reject(err.message || err);
                });
            }
        });
        /**
         * Recursively generates tree
         * @param node
         * @returns
         */
        function readdirtree(node) {
            return __awaiter(this, void 0, void 0, function* () {
                if (node.isFile || node.children === undefined) {
                    return;
                }
                try {
                    const children = (yield unixreaddir(join(node.path, node.name), {
                        withFileTypes: true,
                    }));
                    for (let i = 0; i < children.length; i++) {
                        const child = children[i];
                        const childNode = new TreeNode(child.name, child.path, child.isFile(), child.isFile() ? undefined : []);
                        node.children.push(childNode);
                        yield readdirtree(childNode);
                    }
                }
                catch (err) {
                    throw Error(`Error: ${err}`);
                }
            });
        }
    });
}

export { TreeNode, unixreaddir };
