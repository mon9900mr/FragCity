/* FragCity skin catalog loader (browser-side JavaScript).
 * Scans the repository image folders and joins them with the official JSON names.
 * GitHub Pages cannot execute server-side code; this script is a client-side catalog loader.
 */
(() => {
  'use strict';
  const OWNER = 'mon9900mr';
  const REPO = 'FragCity';
  const BRANCH = 'fragcity-redesign';
  const API = 'https://api.github.com/repos/' + OWNER + '/' + REPO;
  const RAW = 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' + BRANCH + '/';
  const GITHACK = 'https://raw.githack.com/' + OWNER + '/' + REPO + '/' + BRANCH + '/';
  const imageExt = /\.(png|jpe?g|webp|gif)$/i;
  const timeoutMs = 12000;

  async function fetchJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal, cache: 'force-cache' });
      if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + url);
      return await response.json();
    } finally { clearTimeout(timer); }
  }

  async function fetchFirst(paths) {
    let lastError;
    for (const path of paths) {
      try { return await fetchJson(path); } catch (error) { lastError = error; }
    }
    throw lastError || new Error('No catalog source available.');
  }

  function imageUrl(path) {
    return RAW + path.split('/').map(encodeURIComponent).join('/');
  }

  async function load() {
    const treeUrl = API + '/git/trees/' + BRANCH + '?recursive=1';
    const results = await Promise.allSettled([
      fetchFirst([RAW + 'data/skins_en.json', GITHACK + 'data/skins_en.json']),
      fetchFirst([RAW + 'data/agents_en.json', GITHACK + 'data/agents_en.json']),
      fetchFirst([RAW + 'data/gloves_en.json', GITHACK + 'data/gloves_en.json']),
      fetchJson(treeUrl)
    ]);
    const [skinsResult, agentsResult, glovesResult, treeResult] = results;
    const catalog = {
      weapons: skinsResult.status === 'fulfilled' && Array.isArray(skinsResult.value) ? skinsResult.value : [],
      agents: agentsResult.status === 'fulfilled' && Array.isArray(agentsResult.value) ? agentsResult.value : [],
      gloves: glovesResult.status === 'fulfilled' && Array.isArray(glovesResult.value) ? glovesResult.value : [],
      imageFiles: [],
      sourceErrors: results.map((r, i) => r.status === 'rejected' ? ({ source: ['weapon JSON','agent JSON','glove JSON','image index'][i], message: String(r.reason) }) : null).filter(Boolean)
    };
    if (treeResult.status === 'fulfilled' && Array.isArray(treeResult.value.tree)) {
      catalog.imageFiles = treeResult.value.tree
        .filter(item => item.type === 'blob' && imageExt.test(item.path) &&
          (item.path.startsWith('img/skins/') || item.path.startsWith('img/weapon/')))
        .map(item => ({
          path: item.path,
          filename: item.path.split('/').pop(),
          name: item.path.split('/').pop().replace(imageExt, '').replace(/[_-]+/g, ' '),
          url: imageUrl(item.path),
          category: item.path.startsWith('img/weapon/') ? 'weapon' : 'skin'
        }));
    }
    if (!catalog.weapons.length && !catalog.agents.length && !catalog.gloves.length && !catalog.imageFiles.length) {
      throw new Error('Neither catalog JSON nor image directory index could be loaded. Check network access to GitHub.');
    }
    return catalog;
  }

  window.FragCitySkinBackend = Object.freeze({ load });
})();