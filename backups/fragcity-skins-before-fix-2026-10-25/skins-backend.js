/* FRAG CITY — fresh image-only scanner.
 * Does not read skins JSON or any previous catalog. Enumerates image blobs from Git's tree.
 */
(() => {
  'use strict';
  const OWNER='mon9900mr';
  const REPO='FragCity';
  const BRANCH='fragcity-redesign';
  const API='https://api.github.com/repos/'+OWNER+'/'+REPO+'/git/trees/'+BRANCH+'?recursive=1';
  const RAW='https://raw.githubusercontent.com/'+OWNER+'/'+REPO+'/'+BRANCH+'/';
  const IMAGE_EXT=/\.(png|jpe?g|webp|gif|avif)$/i;
  const ROOTS=['img/skins/','img/weapon/'];
  function category(path,filename){
    const s=(path+' '+filename).toLowerCase();
    if(path.startsWith('img/weapon/') || /(^|[\/_-])weapon[_-]/i.test(filename) || /^weapon_/i.test(filename)) return 'weapons';
    if(/(^|[\/_-])(glove|gloves|handwear)([_.\/-]|$)/i.test(s)) return 'gloves';
    if(/(^|[\/_-])agent([_.\/-]|$)/i.test(s)) return 'agents';
    return 'other';
  }
  function label(filename){
    return filename.replace(IMAGE_EXT,'').replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim();
  }
  async function scan(){
    const response=await fetch(API,{headers:{'Accept':'application/vnd.github+json'},cache:'no-store'});
    if(!response.ok) throw new Error('GitHub image scan failed: HTTP '+response.status+'. Check repository visibility/API rate limit.');
    const data=await response.json();
    if(!Array.isArray(data.tree)) throw new Error('Git tree response is missing its file list.');
    if(data.truncated) throw new Error('GitHub truncated the repository tree; image scan cannot safely claim completeness.');
    const files=data.tree.filter(f=>f.type==='blob'&&IMAGE_EXT.test(f.path)&&ROOTS.some(root=>f.path.startsWith(root))).map(f=>{
      const filename=f.path.split('/').pop();
      return {path:f.path,filename,label:label(filename),kind:category(f.path,filename),url:RAW+f.path.split('/').map(encodeURIComponent).join('/')};
    });
    if(!files.length) throw new Error('The repository scan returned zero images in img/skins and img/weapon.');
    return files;
  }
  window.FragCitySkinBackend=Object.freeze({scan});
})();