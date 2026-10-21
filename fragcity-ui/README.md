# FRAG CITY UI — Redesign Preview

A separate, multi-page front-end concept inspired by the dark esports presentation style of CS2RED. This folder is intentionally isolated from the existing PHP backend: no existing backend files are changed.

## Pages
- `index.html` — landing page
- `servers.html` — server plans
- `manage.html` — server management dashboard concept
- `skins.html` — CS2 skins catalog concept
- `guides.html` — guides and setup steps
- `support.html` — support form concept

## Preview locally
Run any static server from the repository root, for example:
```bash
python -m http.server 8080
```
Then open `http://localhost:8080/fragcity-ui/`.

## Integration note
This is a front-end preview only. Purchase, authentication, payment, server console, live status, and skin-change actions are demo interactions until connected to verified backend endpoints. The current PHP backend remains unchanged. Before production, map the UI actions to existing API routes, validate permissions server-side, and never expose server credentials or agent secrets in browser JavaScript.
