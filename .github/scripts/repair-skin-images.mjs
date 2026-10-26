import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const catalogPath = path.join(root, 'fragcity-ui/assets/data/all-skins.json');
const imageDir = path.join(root, 'img/skins');
const reportPath = path.join(root, 'fragcity-ui/assets/data/skin-image-audit.json');
const apiUrls = [
  'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins_not_grouped.json',
  'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json',
  'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/agents.json',
  'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/gloves.json',
  'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/base_weapons.json',
  'https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/all.json'
];
const norm = v => String(v || '').normalize('NFKD').toLowerCase()
  .replace(/[★™®]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function getJson(url) {
  const r = await fetch(url, {headers:{'user-agent':'FragCity-SkinImageRepair/1.0'}, signal:AbortSignal.timeout(45000)});
  if (!r.ok) throw new Error(url + ' HTTP ' + r.status);
  return r.json();
}
async function downloadImage(url, dest) {
  for (let attempt=0; attempt<3; attempt++) {
    try {
      const r = await fetch(url, {headers:{'user-agent':'FragCity-SkinImageRepair/1.0'}, signal:AbortSignal.timeout(25000), redirect:'follow'});
      if (!r.ok) throw new Error('HTTP '+r.status);
      const type = (r.headers.get('content-type') || '').toLowerCase();
      if (type && !type.startsWith('image/') && !type.includes('octet-stream')) throw new Error('Not an image: '+type);
      const bytes = Buffer.from(await r.arrayBuffer());
      if (bytes.length < 100 || bytes.length > 12*1024*1024) throw new Error('Unexpected image size '+bytes.length);
      const sig = bytes.subarray(0, 12);
      const valid = (sig[0]===0x89 && sig.toString('ascii',1,4)==='PNG') ||
        (sig[0]===0xff && sig[1]===0xd8) ||
        sig.toString('ascii',0,4)==='RIFF' || sig.toString('ascii',0,3)==='GIF' ||
        sig.toString('ascii',0,4)==='<svg' || sig.toString('ascii',0,5)==='<?xml';
      if (!valid) throw new Error('Image signature invalid');
      await fs.writeFile(dest, bytes);
      return true;
    } catch(e) {
      if (attempt===2) return false;
      await sleep(700*(attempt+1));
    }
  }
  return false;
}
const catalogRaw = await fs.readFile(catalogPath, 'utf8');
const catalog = JSON.parse(catalogRaw);
if (!Array.isArray(catalog)) throw new Error('Expected all-skins.json to be an array');
await fs.mkdir(imageDir, {recursive:true});
const files = await fs.readdir(imageDir);
const fileMap = new Map(files.map(f=>[norm(path.parse(f).name),f]));
const sources = [];
for (const url of apiUrls) {
  try { const data = await getJson(url); if (Array.isArray(data)) sources.push(...data); }
  catch(e) { console.log('Source skipped:', url, String(e)); }
}
const sourceByName = new Map();
for (const item of sources) {
  if (!item?.name || !item?.image) continue;
  const key = norm(item.name);
  if (!sourceByName.has(key)) sourceByName.set(key, item);
  if (item.market_hash_name) sourceByName.set(norm(item.market_hash_name), item);
}
let alreadyGood=0, fixedPaths=0, downloaded=0, missing=0, failed=0, invalidFiles=0;
const missingItems=[];
const invalidItems=[];
const reserved=new Set(files.map(f=>f.toLowerCase()));
const fileSet=new Set(files);
const imageExts=new Set(['.png','.jpg','.jpeg','.webp','.gif','.svg']);
async function isReadableImage(filename) {
  try {
    const full=path.join(imageDir,filename);
    const st=await fs.stat(full);
    if (!st.isFile() || st.size < 100) return false;
    const ext=path.extname(filename).toLowerCase();
    if (!imageExts.has(ext)) return false;
    const h=await fs.open(full,'r');
    try {
      const b=Buffer.alloc(16);
      const {bytesRead}=await h.read(b,0,b.length,0);
      if (bytesRead < 3) return false;
      return (b[0]===0x89 && b.toString('ascii',1,4)==='PNG') ||
        (b[0]===0xff && b[1]===0xd8) ||
        b.toString('ascii',0,4)==='RIFF' ||
        b.toString('ascii',0,3)==='GIF' ||
        b.toString('ascii',0,4)==='<svg' ||
        b.toString('ascii',0,5)==='<?xml';
    } finally { await h.close(); }
  } catch { return false; }
}
for (const item of catalog) {
  if (!item || typeof item!=='object' || !item.name) continue;
  const candidatePaths = [item.imagePath, item.image_path, item.localImage, item.image]
    .filter(v => typeof v === 'string' && !v.startsWith('data:') &&
      !v.toLowerCase().startsWith('http://') && !v.toLowerCase().startsWith('https://'));
  let localFile = null;
  for (const p of candidatePaths) {
    const normalized = p.split(/[?#]/)[0].split(String.fromCharCode(92)).join('/');
    const base = path.basename(normalized);
    if (!base) continue;
    if (fileSet.has(base) && await isReadableImage(base)) { localFile = base; break; }
    const matched = fileMap.get(norm(path.parse(base).name));
    if (matched && await isReadableImage(matched)) { localFile = matched; break; }
  }
  if (localFile) {
    const correct = '../img/skins/' + localFile;
    if (item.imagePath !== correct) { item.imagePath = correct; fixedPaths++; }
    alreadyGood++;
    continue;
  }
  const normalizedName = norm(item.name);
  const withoutVariant = norm(String(item.name).replace(/\s*\([^)]*\)\s*$/, ''));
  const withoutDefault = norm(String(item.name).replace(/\s*\|\s*default\s*$/i, ''));
  const source = sourceByName.get(normalizedName) ||
    sourceByName.get(withoutVariant) ||
    (/(^| )default$/.test(normalizedName) ? sourceByName.get(withoutDefault) : null);
  if (!source?.image) {
    missing++;
    missingItems.push({name:item.name, reason:'not-found-in-image-source', oldPath:item.imagePath || null});
    continue;
  }
  const sourceUrl = String(source.image).toLowerCase();
  const ext = sourceUrl.includes('.jpeg') || sourceUrl.includes('.jpg') ? '.jpg' :
    sourceUrl.includes('.webp') ? '.webp' : '.png';
  const baseName = String(item.name).replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').replace(/\s+/g, ' ').trim().slice(0,150);
  let filename = baseName + ext, n = 2;
  while (reserved.has(filename.toLowerCase())) filename = baseName + ' (' + n++ + ')' + ext;
  const dest = path.join(imageDir, filename);
  const ok = await downloadImage(source.image, dest);
  if (ok && await isReadableImage(filename)) {
    reserved.add(filename.toLowerCase()); files.push(filename); fileSet.add(filename);
    item.imagePath = '../img/skins/' + filename; item.image = source.image;
    downloaded++; fileMap.set(norm(path.parse(filename).name), filename);
  } else {
    failed++; invalidFiles++;
    missingItems.push({name:item.name, reason:'download-failed-or-invalid-image', source:source.image, oldPath:item.imagePath || null});
  }
}
await fs.writeFile(catalogPath, JSON.stringify(catalog,null,2)+'\n');
const report={generatedAt:new Date().toISOString(),catalogItems:catalog.length,sourceItems:sources.length,existingAndValidatedLocalImages:alreadyGood,pathsCorrected:fixedPaths,imagesDownloaded:downloaded,unmatchedItems:missing,downloadFailures:failed,invalidFiles,unresolved:missingItems}
