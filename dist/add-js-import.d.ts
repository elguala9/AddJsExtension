#!/usr/bin/env ts-node
/**
 * Recursively finds all `index.ts` files under a target directory,
 * excluding directories with names in the `excludedDirs` list.
 *
 * @param dir - the directory to search in
 * @param excludedDirs - array of directory names to exclude
 * @returns array of absolute paths to `index.ts` files
 */
export declare function findIndexTsPaths(dir: string, excludedDirs?: string[]): string[];
export declare function processFile(filePath: string): void;
