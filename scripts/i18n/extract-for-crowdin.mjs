import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const TRANSLATIONS_FILE = path.join(repoRoot, "packages/shared/src/i18n/translations.ts");
const OUT_DIR = path.join(repoRoot, "packages/shared/src/i18n/crowdin");

function findObjectLiteralBlock(source, declarationRegex) {
    const declarationMatch = declarationRegex.exec(source);
    if (!declarationMatch) {
        throw new Error(`Could not find declaration: ${declarationRegex}`);
    }

    const declIndex = declarationMatch.index;
    const openIndex = source.indexOf("{", declIndex);
    if (openIndex === -1) {
        throw new Error(`Could not find object start for declaration: ${declarationRegex}`);
    }

    let i = openIndex;
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
    let inLineComment = false;
    let inBlockComment = false;
    let escaped = false;

    while (i < source.length) {
        const ch = source[i];
        const next = source[i + 1] ?? "";

        if (inLineComment) {
            if (ch === "\n") {
                inLineComment = false;
            }
            i += 1;
            continue;
        }

        if (inBlockComment) {
            if (ch === "*" && next === "/") {
                inBlockComment = false;
                i += 2;
                continue;
            }
            i += 1;
            continue;
        }

        if (!inSingle && !inDouble && !inTemplate) {
            if (ch === "/" && next === "/") {
                inLineComment = true;
                i += 2;
                continue;
            }

            if (ch === "/" && next === "*") {
                inBlockComment = true;
                i += 2;
                continue;
            }
        }

        if (inSingle || inDouble || inTemplate) {
            if (escaped) {
                escaped = false;
                i += 1;
                continue;
            }

            if (ch === "\\") {
                escaped = true;
                i += 1;
                continue;
            }

            if (inSingle && ch === "'") {
                inSingle = false;
            } else if (inDouble && ch === "\"") {
                inDouble = false;
            } else if (inTemplate && ch === "`") {
                inTemplate = false;
            }

            i += 1;
            continue;
        }

        if (ch === "'") {
            inSingle = true;
            i += 1;
            continue;
        }

        if (ch === "\"") {
            inDouble = true;
            i += 1;
            continue;
        }

        if (ch === "`") {
            inTemplate = true;
            i += 1;
            continue;
        }

        if (ch === "{") {
            depth += 1;
        } else if (ch === "}") {
            depth -= 1;
            if (depth === 0) {
                return source.slice(openIndex, i + 1);
            }
        }

        i += 1;
    }

    throw new Error(`Could not find object end for declaration: ${declarationRegex}`);
}

function parseObjectLiteral(literal) {
    return vm.runInNewContext(`(${literal})`, {});
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function main() {
    const source = fs.readFileSync(TRANSLATIONS_FILE, "utf8");

    const enLiteral = findObjectLiteralBlock(source, /const\s+en\s*=\s*{/);
    const faLiteral = findObjectLiteralBlock(source, /const\s+fa\s*:\s*Record<keyof\s+typeof\s+en,\s*string>\s*=\s*{/);
    const psLiteral = findObjectLiteralBlock(source, /const\s+ps\s*:\s*Record<keyof\s+typeof\s+en,\s*string>\s*=\s*{/);

    const en = parseObjectLiteral(enLiteral);
    const fa = parseObjectLiteral(faLiteral);
    const ps = parseObjectLiteral(psLiteral);

    fs.mkdirSync(OUT_DIR, { recursive: true });

    writeJson(path.join(OUT_DIR, "en.json"), en);
    writeJson(path.join(OUT_DIR, "fa.json"), fa);
    writeJson(path.join(OUT_DIR, "ps.json"), ps);

    console.log("Crowdin source files generated:");
    console.log(`- ${path.relative(repoRoot, path.join(OUT_DIR, "en.json"))}`);
    console.log(`- ${path.relative(repoRoot, path.join(OUT_DIR, "fa.json"))}`);
    console.log(`- ${path.relative(repoRoot, path.join(OUT_DIR, "ps.json"))}`);
}

main();
