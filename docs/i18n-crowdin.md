# Crowdin Translation Hosting Setup

This setup lets the author department edit translations in Crowdin while this repository stays the source of runtime translations.

## What was added

- `crowdin.yml`
- `scripts/i18n/extract-for-crowdin.mjs`
- `scripts/i18n/apply-crowdin-to-translations.mjs`
- `.github/workflows/i18n-crowdin-upload.yml`
- `.github/workflows/i18n-crowdin-download.yml`
- Root scripts in `package.json`

## How it works

1. Source of truth in code remains `packages/shared/src/i18n/translations.ts`.
2. Export step converts `en/fa/ps` objects into JSON files in `packages/shared/src/i18n/crowdin`.
3. Upload workflow sends `en.json` to Crowdin.
4. Author department edits `fa` and `ps` in Crowdin web UI.
5. Download workflow pulls translations, updates `translations.ts`, and opens a PR.

## One-time setup

1. Create a Crowdin project.
2. In Crowdin project settings, use language codes:
   - `en`
   - `fa`
   - `ps`
3. In GitHub repository secrets, add:
   - `CROWDIN_PROJECT_ID`
   - `CROWDIN_PERSONAL_TOKEN`
4. Run the GitHub workflow `i18n Crowdin Upload` once (manual trigger).

## Day-to-day usage

### Engineering updates keys/text in English

- Edit `packages/shared/src/i18n/translations.ts`
- Push to `main` or `master`
- `i18n Crowdin Upload` runs automatically and refreshes source strings in Crowdin

### Author department updates translations

- Edit strings in Crowdin UI
- Wait for scheduled download workflow or run `i18n Crowdin Download` manually
- Review and merge generated PR

## Local commands

- Export JSON for Crowdin:
  - `pnpm i18n:crowdin:extract`
- Apply JSON into `translations.ts`:
  - `pnpm i18n:crowdin:apply`

## Notes

- Applying from Crowdin rewrites locale object blocks in `translations.ts`.
- Keep section comments outside those blocks if you need persistent documentation.
- If you use branch protection, allow the PR from `chore/crowdin-translation-sync`.
