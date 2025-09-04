
# AddJsExtension

Script to add the `.js` extension to ESM imports in `index.ts` files within a directory.

## Features
- Recursively scans a directory and finds all `index.ts` files.
- Adds `.js` to imports and require statements that do not already have it.
- Allows excluding directories and specific paths via parameters.

## Usage

### From terminal

```sh
npm run add-js-import
```

To specify a different directory:

```sh
npm run add-js-import <directory>
```

To exclude a directory by name:

```sh
npm run add-js-import <directory> -ed <directory-name-to-exclude>
```

To exclude specific paths:

```sh
npm run add-js-import <directory> -e <path1> <path2>
```

## Examples

- Scan the current directory:
  ```sh
  npm run add-js-import -- .
  ```
- Exclude the `test-no` directory:
  ```sh
  npm run add-js-import -- . -ed test-no
  ```
- Exclude specific paths:
  ```sh
  npm run add-js-import -- . -e ./test/index.ts ./src/other.ts
  ```

## Author
Luca Gualandi
