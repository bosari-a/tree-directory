import { readdir, stat } from 'fs/promises';
import { normalize, join, basename, dirname } from 'path/posix';

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
 *
 * @param parent
 * @returns
 */
function unixreaddir(parent) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            readdir(parent, { recursive: true })
                .then((paths) => {
                resolve(paths.map((path) => normalize(path.replace(/\\/g, "/"))));
            })
                .catch((err) => {
                reject(err.message || err);
            });
        });
    });
}
/**
 *
 * @param parent
 * @param paths
 * @returns
 */
function dirdata(parent, paths) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const pathDataPromises = paths.map((path) => __awaiter(this, void 0, void 0, function* () {
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
            }));
            Promise.all(pathDataPromises)
                .then((values) => {
                resolve(values);
            })
                .catch((err) => {
                reject(err.message || err);
            });
        });
    });
}
/**
 *
 * @param pathData
 * @param paths
 * @returns
 */
function group(pathData, paths) {
    return paths
        .filter((path) => !path.includes("/"))
        .map((parent) => {
        const regexp = new RegExp(`^${parent}`);
        const family = pathData.filter((data) => data.dirname.match(regexp) || parent === data.basename);
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
function tree(parent) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}

export { dirdata, group, tree, unixreaddir };
