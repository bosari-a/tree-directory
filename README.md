# Tree directory

## Installation:

`npm install directoree`

### unixreaddir

This function (the only one exported) in the package is meant to replace common general usecases for node's native `fs/promises` `readdir` module.

## The name

The name might suggest that this somehow only works in unix or something but it's for a different reason. This package was born out of my discontent with `win32` path conventions. In `win32` paths use `\` or `\\` instead of `/`. This package aims to read your input (whether it's a `win32` path or `unix` path) and output `unix` style paths.

## Recursive option

Setting `{ recursive : true }` when calling `unixreaddir` will generate a tree structure of the directory you are trying to access.

## Usage:

For these examples the directory structure looks like this:

```bash
$ tree parent
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

### Example 1. Basic `readdir` no options

```ts
import { unixreaddir } from "directoree";

unixreaddir("parent").then((result) => {
  console.dir(result, { depth: null });
});
/*
[ 'sibling0', 'sibling1', 'sibling2' ]
*/
```

### Example 2. `{ withFileTypes : true }`

```ts
import { unixreaddir } from "directoree";

unixreaddir("parent", { withFileTypes: true }).then((result) => {
  console.dir(result, { depth: null });
});
/*
[
  Dirent { name: 'sibling0', path: 'parent', [Symbol(type)]: 2 },
  Dirent { name: 'sibling1', path: 'parent', [Symbol(type)]: 2 },
  Dirent { name: 'sibling2', path: 'parent', [Symbol(type)]: 2 }
]
*/
```

Check [Dirent](https://nodejs.org/api/fs.html#class-fsdirent) for more details.

### Example 3. `{ recursive : true }`

```ts
import { unixreaddir } from "directoree";

unixreaddir("parent", { recursive: true }).then((tree) => {
  console.dir(tree, { depth: null });
});

/*
TreeNode {
  name: 'parent',
  path: '.',
  isFile: false,
  children: [
    TreeNode {
      name: 'sibling0',
      path: 'parent',
      isFile: false,
      children: [
        TreeNode {
          name: 'a',
          path: 'parent/sibling0',
          isFile: false,
          children: [
            TreeNode {
              name: 'b',
              path: 'parent/sibling0/a',
              isFile: false,
              children: [
                TreeNode {
                  name: 'c',
                  path: 'parent/sibling0/a/b',
                  isFile: false,
                  children: [
                    TreeNode {
                      name: 'd.txt',
                      path: 'parent/sibling0/a/b/c',
                      isFile: true,
                      children: undefined
                    }
                  ]
                }
              ]
            }
          ]
        },
        TreeNode {
          name: 'file1.txt',
          path: 'parent/sibling0',
          isFile: true,
          children: undefined
        },
        TreeNode {
          name: 'subdir',
          path: 'parent/sibling0',
          isFile: false,
          children: [
            TreeNode {
              name: 'file1.txt',
              path: 'parent/sibling0/subdir',
              isFile: true,
              children: undefined
            },
            TreeNode {
              name: 'file2.txt',
              path: 'parent/sibling0/subdir',
              isFile: true,
              children: undefined
            }
          ]
        }
      ]
    },
    TreeNode {
      name: 'sibling1',
      path: 'parent',
      isFile: false,
      children: [
        TreeNode {
          name: 'file1.txt',
          path: 'parent/sibling1',
          isFile: true,
          children: undefined
        },
        TreeNode {
          name: 'file2.txt',
          path: 'parent/sibling1',
          isFile: true,
          children: undefined
        }
      ]
    },
    TreeNode {
      name: 'sibling2',
      path: 'parent',
      isFile: false,
      children: []
    }
  ]
}
*/
```

## Documentation:

You can check [the docs](https://bosari-a.github.io/tree-directory/) for more details.
