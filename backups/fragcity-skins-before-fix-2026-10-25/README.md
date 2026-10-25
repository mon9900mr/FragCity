# FragCity skins pre-fix backup

Created 2026-10-25 from `fragcity-redesign` before the skin fixes. Work is isolated on `fragcity-skins-fix`; the original `fragcity-redesign` branch remains unchanged and is also a rollback point.

Backed up original files:
- `skins.html` — original single Dragon Lore test page.
- `app.js` — original shared front-end logic.
- `style.css` — original shared styling.
- `skins-backend.js` — original image scanner.

The original `assets/data/all-skins.json` is a large existing catalog (about 1.79 MB) and is not being rewritten. It remains unchanged on this branch and on `fragcity-redesign`; the earlier file-content reader returned an empty response for that large file, not an empty repository file.

No image files or backend/PHP files are modified by these fixes. To roll back the UI, restore the backed-up files above to their original paths, or switch back to `fragcity-redesign`.
