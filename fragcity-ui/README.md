# FRAG CITY UI — Backend-connected entry points

This multi-page UI is a visual front-end layer inside the existing FragCity PHP repository. The root PHP application is the source of truth; do not replace it with a second mock backend.

## Existing backend routes used by this UI

- Server purchase/configuration and checkout: `../index.php?page=buyserveropen`
- Registered/live server list: `../index.php?page=servers_vps`
- Account-aware weapon-paint management: `../index.php?page=weaponpaints`
- User guide/manual: `../index.php?page=usermanual`
- Support and ticket history/submission: `../index.php?page=support`
- CS2 owner panel: `../panels/cs2/index.php?page=overview`

The repository also contains the existing PHP account/login and Steam OpenID flows, wallet and payment callbacks, server/node agent endpoints, server configuration/port APIs, RCON command API, skin sync, plugin integration, CS2 panel pages, database/configuration loader, and architecture/security runbooks. These existing backend files are kept in place; this UI does not duplicate their secrets or access the database directly from browser JavaScript.

## Important deployment notes

- The cards and sample prices in `servers.html` remain illustrative; use the real PHP purchase page for current prices, node availability, server options, wallet balance, and checkout.
- Panel actions redirect to the existing authenticated panel instead of pretending to start/stop a server from this static page.
- Skin selection redirects to the existing backend skin-management page; applying a cosmetic depends on account permissions and server/plugin support.
- Support submissions should be made on the real PHP support page.
- Do not expose database credentials, agent secrets, RCON passwords, or payment secrets in client-side code.
- Before production deployment, review the backend configuration and security documentation and rotate any credentials that have ever been committed to source control. Keep the current PHP backend behavior unchanged unless separately requested.

## Preview locally

From the repository root:
```bash
python -m http.server 8080
```
Open `http://localhost:8080/fragcity-ui/`. Backend links require a PHP-capable web server and a correctly configured FragCity database; Python's static server only previews the UI.
