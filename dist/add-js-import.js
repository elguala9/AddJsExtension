#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIndexTsPaths = findIndexTsPaths;
exports.processFile = processFile;
var fs = require("fs");
var path = require("path");
/**
 * Recursively finds all `index.ts` files under a target directory,
 * excluding directories with names in the `excludedDirs` list.
 *
 * @param dir - the directory to search in
 * @param excludedDirs - array of directory names to exclude
 * @returns array of absolute paths to `index.ts` files
 */
function findIndexTsPaths(dir, excludedDirs, excludedPaths) {
    if (excludedDirs === void 0) { excludedDirs = []; }
    if (excludedPaths === void 0) { excludedPaths = []; }
    var results = [];
    var entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    }
    catch (err) {
        console.warn("\u26A0\uFE0F  Skipping non-existent or unreadable directory: ".concat(dir));
        return results;
    }
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (excludedDirs.includes(entry.name)) {
                continue;
            }
            results.push.apply(results, findIndexTsPaths(fullPath, excludedDirs, excludedPaths));
        }
        else if (entry.isFile() && entry.name === 'index.ts') {
            // Escludi se il percorso è tra quelli esclusi
            if (!excludedPaths.includes(path.resolve(fullPath))) {
                results.push(fullPath);
            }
        }
    }
    return results;
}
function processFile(filePath) {
    var content = fs.readFileSync(filePath, 'utf8');
    // Aggiunge .js a tutti gli import che non lo hanno già
    var updated = content
        .replace(/(from\s+['"])([^'";]+)(['";])/g, function (all, p1, p2, p3) {
        if (p2.endsWith('.js'))
            return all;
        return "".concat(p1).concat(p2, ".js").concat(p3);
    })
        .replace(/(require\(['"])([^'"]+)(['"]\))/g, function (all, p1, p2, p3) {
        if (p2.endsWith('.js'))
            return all;
        return "".concat(p1).concat(p2, ".js").concat(p3);
    });
    if (updated !== content) {
        fs.writeFileSync(filePath, updated, 'utf8');
        console.log("\u2714 Updated ".concat(filePath));
    }
}
function parseArgs() {
    var _a;
    var args = process.argv.slice(2);
    var edIndex = args.indexOf('-ed');
    var eIndex = args.indexOf('-e');
    var targetDir = edIndex === -1 && eIndex === -1
        ? (_a = args[0]) !== null && _a !== void 0 ? _a : path.join(process.cwd(), 'packages')
        : args[0] === '-ed' || args[0] === '-e'
            ? path.join(process.cwd(), 'packages')
            : path.resolve(args[0]);
    var excludedDirs = edIndex !== -1 ? args.slice(edIndex + 1, eIndex !== -1 ? eIndex : undefined) : [];
    var excludedPaths = eIndex !== -1 ? args.slice(eIndex + 1) : [];
    return { targetDir: targetDir, excludedDirs: excludedDirs, excludedPaths: excludedPaths };
}
function main() {
    var _a = parseArgs(), targetDir = _a.targetDir, excludedDirs = _a.excludedDirs, excludedPaths = _a.excludedPaths;
    console.log("Scanning \"".concat(targetDir, "\""));
    if (excludedDirs.length > 0) {
        console.log("Excluding directories by name: ".concat(excludedDirs.join(', ')));
    }
    var indexPaths = findIndexTsPaths(targetDir, excludedDirs, excludedPaths);
    console.log('Found index.ts files:');
    indexPaths.forEach(function (p) { return console.log(p); });
    indexPaths.forEach(processFile);
    console.log('Done processing index.ts files.');
}
if (require.main === module) {
    main();
}
