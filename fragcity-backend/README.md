# FragCity Skins API (JavaScript only)

This folder is a Node.js API for saving a selected CS2 skin to a PostgreSQL database.

## Environment

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: optional, defaults to 3000
- `PGSSL=false`: optional, disables TLS only for local development

## Run

```sh
cd fragcity-backend
npm install
npm start
```

## Authentication integration is required

Before exposing the API, mount the existing FragCity Steam login/session middleware so verified requests have `req.user.steamId`. This API deliberately does not trust a Steam ID sent in the request body. Without that middleware, the apply/list routes return `401 LOGIN_REQUIRED`.

## Routes

- `GET /health`
- `GET /api/skins/catalog/health`
- `POST /api/skins/apply` with JSON `{ "weaponDefindex": 7, "paintKit": 180, "wear": 0.001, "seed": 0 }`
- `GET /api/skins/mine`

The API stores the selection in `fragcity_account_skins`. **This does not, by itself, change the skin in-game.** The CS2 server plugin must read this table and apply the stored paint to the player's weapon. Connect the plugin to this schema before advertising the feature as live.
