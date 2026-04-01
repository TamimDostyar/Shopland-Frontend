import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const TRANSLATIONS_FILE = path.join(repoRoot, "packages/shared/src/i18n/translations.ts");
const CROWDIN_DIR = path.join(repoRoot, "packages/shared/src/i18n/crowdin");

function readLocale(locale) {
    const filePath = path.join(CROWDIN_DIR, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing locale file: ${path.relative(repoRoot, filePath)}`);
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function toTsObjectString(obj, indent = "  ") {
    const entries = Object.entries(obj);
    const lines = ["{"];

    for (const [key, value] of entries) {
        lines.push(`${indent}${JSON.stringify(key)}: ${JSON.stringify(String(value))},`);
    }

    lines.push("}");
    return lines.join("\n");
}

function replaceBetween(source, startMarker, endMarker, replacement) {
    const start = source.indexOf(startMarker);
    if (start === -1) {
        throw new Error(`Could not find start marker: ${startMarker}`);
    }

    const end = source.indexOf(endMarker, start);
    if (end === -1) {
        throw new Error(`Could not find end marker: ${endMarker}`);
    }

    return source.slice(0, start) + replacement + source.slice(end);
}

function main() {
    const en = readLocale("en");
    const fa = readLocale("fa");
    const ps = readLocale("ps");

    const source = fs.readFileSync(TRANSLATIONS_FILE, "utf8");

    const enBlock = `const en = ${toTsObjectString(en)} as const;\n\n`;
    const faBlock = `const fa: Record<keyof typeof en, string> = ${toTsObjectString(fa)};\n\n`;
    const psBlock = `const ps: Record<keyof typeof en, string> = ${toTsObjectString(ps)};\n\n`;

    let updated = source;
    updated = replaceBetween(updated, "const en =", "const fa:", enBlock);
    updated = replaceBetween(updated, "const fa:", "const ps:", faBlock);
    updated = replaceBetween(updated, "const ps:", "export const UI_TRANSLATIONS", psBlock);

    fs.writeFileSync(TRANSLATIONS_FILE, updated, "utf8");

    console.log("Updated translations file from Crowdin JSON:");
    console.log(`- ${path.relative(repoRoot, TRANSLATIONS_FILE)}`);
}

main();
