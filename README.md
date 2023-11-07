# Tree-directory

`npm install directoree`

```bash
$ node -v
v20.5.1
```

## Usage

Consider the following directory tree:

```bash
parent/
├── sibling0
│   ├── file1.txt
│   └── subdir
│       ├── file1.txt
│       └── file2.txt
├── sibling1
│   ├── file1.txt
│   └── file2.txt
└── sibling2
```

You can then import `tree` which works in the following way:

```ts
import { tree } from "tree-directory";

tree("parents").then((data) => console.dir(data, { depth: null }));

/*

[
  [
    [
      { basename: 'sibling0', dirname: '.', isFile: false },
      { basename: 'subdir', dirname: 'sibling0', isFile: false }
    ],
    [
      { basename: 'file1.txt', dirname: 'sibling0', isFile: true },
      {
        basename: 'file1.txt',
        dirname: 'sibling0/subdir',
        isFile: true
      },
      {
        basename: 'file2.txt',
        dirname: 'sibling0/subdir',
        isFile: true
      }
    ]
  ],
  [
    [ { basename: 'sibling1', dirname: '.', isFile: false } ],
    [
      { basename: 'file1.txt', dirname: 'sibling1', isFile: true },
      { basename: 'file2.txt', dirname: 'sibling1', isFile: true }
    ]
  ],
  [ [ { basename: 'sibling2', dirname: '.', isFile: false } ], [] ]
]

*/
```

## This is is still quite primitive

This won't be helpful if your paths are complicated. I am working on that currently. Example:

```bash
parent/
├── sibling0
│   ├── a
│   │   └── b
│   │       └── c
│   │           └── d.txt
│   ├── file1.txt
│   └── subdir
│       ├── file1.txt
│       └── file2.txt
├── sibling1
│   ├── file1.txt
│   └── file2.txt
└── sibling2
```

This ruins depending on the sorted nature of the arrays and you can no longer assume that any directory chain is valid. Really, if you have more than one subdirectory everything goes out of controll but this is just barely the start and mainly experimenting with how to publish npm packages, dealing with technicalities, etc.

## Exports

### `unixreaddir(parent: string)`

This is an `async` function that resolves with `string[]`. It takes the parent directory as an argument and recurrsively reads it. It makes use of the `{ recursive : true }` option in the [`readdir`](https://nodejs.org/api/fs.html#fspromisesreaddirpath-options).

This function makes use of the `normalize` function from native node module `path/posix` and a simple `regex` line to replace `win32` type paths into `unix` style paths with single slashes for each subdir.

### `dirdata(parent: string, paths: string[])`

This is also an `async` function used internally to generate the tree-like structure.

### `group(pathData: IPathData[], paths: string[])`

Yet another `async` function that takes the resolved promises from `dirdata` and `unixreaddir` respectively.

### `tree(parent: string)`

This function combines it all and generates the tree-like structure. Also `async` and resolves with an array of the data.
