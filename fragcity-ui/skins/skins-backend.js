/* FRAG CITY — repository skin/image scanner.
 * Reads real image paths from the Git tree and matches them with the skin metadata.
 * It does not write to or modify the PHP backend.
 */
(() => {
  'use strict';
  const OWNER = 'mon9900mr';
  const REPO = 'FragCity';
  const BRANCH = 'fragcity-skins-fix';
  const API = 'https://api.github.com/repos/' + OWNER + '/' + REPO + '/git/trees/' + BRANCH + '?recursive=1';
  const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif)$/i;
  const ROOTS = ['img/skins/', 'img/weapon/'];
  const humanize = value => String(value || '').replace(IMAGE_EXT, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

  async function scan() {
    const response = await fetch(API, {headers:{Accept:'application/vnd.github+json'}, cache:'no-store'});
    if (!response.ok) throw new Error('Repository image scan failed (HTTP ' + response.status + ').');
    const data = await response.json();
    if (!Array.isArray(data.tree)) throw new Error('GitHub tree response did not include a file list.');
    if (data.truncated) throw new Error('GitHub truncated the repository tree; image scan cannot confirm a complete catalog.');
    const files = data.tree
      .filter(file => file.type === 'blob' && IMAGE_EXT.test(file.path) && ROOTS.some(root => file.path.startsWith(root)))
      .map(file => ({path:file.path, filename:file.path.split('/').pop(), label:humanize(file.path.split('/').pop()), kind:file.path.startsWith('img/weapon/') ? 'weapon' : 'skin'}));
    if (!files.length) throw new Error('No image files were found under img/skins or img/weapon.');
    return files;
  }

  async function loadCatalog(catalogUrl, catalogData) {
    const imagesPromise = scan().catch(error => { console.warn('FragCity image scan unavailable; using expected image paths.', error); return []; });
    const dataPromise = Array.isArray(catalogData) ? Promise.resolve(catalogData) : fetch(catalogUrl, {cache:'no-store'}).then(response => {
      if (!response.ok) throw new Error('Skin metadata could not load (HTTP ' + response.status + ').');
      return response.json();
    });
    const [images, data] = await Promise.all([imagesPromise, dataPromise]);
    if (!Array.isArray(data) || !data.length) throw new Error('Skin metadata is empty or invalid.');
    const byFilename = new Map();
    // Prefer item renders under img/skins; use img/weapon only when no skin render exists.
    images.sort((a,b) => (a.kind === b.kind ? a.path.localeCompare(b.path) : a.kind === 'skin' ? -1 : 1));
    for (const file of images) {
      const key = file.filename.toLowerCase();
      if (!byFilename.has(key)) byFilename.set(key, file.path);
    }
    return data.filter(item => item && item.name && item.image && item.category).map(item => {
      const filename = String(item.image).split('/').pop();
      const imagePath = byFilename.get(filename.toLowerCase()) || (String(item.image).startsWith('img/') ? item.image : 'img/skins/' + filename);
      return {...item, imagePath, imageFound:byFilename.has(filename.toLowerCase())};
    });
  }

  window.FragCitySkinBackend = Object.freeze({scan, loadCatalog});
})();