'use strict';

// FRAG CITY skin API — Node.js + PostgreSQL.
// The production auth layer must attach a verified Steam account to req.user.
// Never accept account IDs supplied by the browser.
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000
});

// Integration point: mount the existing FragCity Steam/session middleware before this router.
// It must set req.user.steamId only after validating the user's server-side session.
function requireAccount(req, res, next) {
  const steamId = req.user && req.user.steamId;
  if (!steamId || !/^\d{15,20}$/.test(String(steamId))) {
    return res.status(401).json({ ok: false, error: 'LOGIN_REQUIRED' });
  }
  req.accountSteamId = String(steamId);
  next();
}

const router = express.Router();

router.get('/catalog/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, service: 'fragcity-skins', database: 'connected' });
  } catch {
    res.status(503).json({ ok: false, error: 'DATABASE_UNAVAILABLE' });
  }
});

// Stores the selected paint for the authenticated account.
// A CS2 server plugin must read this table and apply the skin in-game.
router.post('/apply', requireAccount, async (req, res) => {
  const weaponDefindex = Number(req.body && req.body.weaponDefindex);
  const paintKit = Number(req.body && req.body.paintKit);
  const wear = req.body && req.body.wear === undefined ? 0.001 : Number(req.body.wear);
  const seed = req.body && req.body.seed === undefined ? 0 : Number(req.body.seed);

  if (!Number.isInteger(weaponDefindex) || weaponDefindex < 1 || weaponDefindex > 600 ||
      !Number.isInteger(paintKit) || paintKit < 0 || paintKit > 100000 ||
      !Number.isFinite(wear) || wear < 0 || wear > 1 ||
      !Number.isInteger(seed) || seed < 0 || seed > 1000) {
    return res.status(400).json({ ok: false, error: 'INVALID_SKIN_SELECTION' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO fragcity_account_skins
         (steam_id, weapon_defindex, paint_kit, wear, seed, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (steam_id, weapon_defindex)
       DO UPDATE SET paint_kit = EXCLUDED.paint_kit,
                     wear = EXCLUDED.wear,
                     seed = EXCLUDED.seed,
                     updated_at = NOW()
       RETURNING steam_id, weapon_defindex, paint_kit, wear, seed, updated_at`,
      [req.accountSteamId, weaponDefindex, paintKit, wear, seed]
    );
    res.json({ ok: true, saved: true, skin: result.rows[0], note: 'Saved for the server plugin to apply.' });
  } catch (error) {
    console.error('skin apply failed:', error.message);
    res.status(500).json({ ok: false, error: 'SKIN_SAVE_FAILED' });
  }
});

router.get('/mine', requireAccount, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT weapon_defindex, paint_kit, wear, seed, updated_at FROM fragcity_account_skins WHERE steam_id = $1 ORDER BY weapon_defindex',
      [req.accountSteamId]
    );
    res.json({ ok: true, skins: result.rows });
  } catch (error) {
    console.error('skin list failed:', error.message);
    res.status(500).json({ ok: false, error: 'SKIN_LIST_FAILED' });
  }
});

app.use('/api/skins', (req, res, next) => {
  // Keep API same-origin by default; configure an explicit allow-list if cross-origin hosting is required.
  res.set('Cache-Control', 'no-store');
  next();
}, router);

app.get('/health', (_req, res) => res.json({ ok: true, service: 'fragcity-skins-api' }));

async function start() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fragcity_account_skins (
      steam_id VARCHAR(20) NOT NULL,
      weapon_defindex INTEGER NOT NULL,
      paint_kit INTEGER NOT NULL,
      wear DOUBLE PRECISION NOT NULL DEFAULT 0.001,
      seed INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (steam_id, weapon_defindex)
    )
  `);
  const port = Number(process.env.PORT || 3000);
  app.listen(port, '0.0.0.0', () => console.log('FragCity skins API listening on ' + port));
}

if (require.main === module) {
  start().catch(error => { console.error(error.message); process.exit(1); });
}

module.exports = { app, pool };
