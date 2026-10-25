/* FragCity skin catalog backend — browser-side JavaScript for static hosting.
 * Scans supported images under img/weapon and img/skins, then merges discovered
 * files with official catalog JSON when available. No PHP is needed to display it.
 */
(() => {
  'use strict';
  const OWNER='mon9900mr', REPO='FragCity', BRANCH='fragcity-redesign';
  const API='https://api.github.com/repos/'+OWNER+'/'+REPO;
  const RAW='https://raw.githubusercontent.com/'+OWNER+'/'+REPO+'/'+BRANCH+'/';
  const GITHACK='https://raw.githack.com/'+OWNER+'/'+REPO+'/'+BRANCH+'/';
  const IMAGE_EXT=/\.(png|jpe?g|webp|gif|avif)$/i;
  const IMAGE_DIRS=['img/weapon/','img/skins/'];
  const timeoutMs=15000;

  async function fetchJson(url){
    const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),timeoutMs);
    try{const response=await fetch(url,{signal:controller.signal,cache:'no-cache'});if(!response.ok)throw new Error('HTTP '+response.status+' — '+url);return await response.json();}
    finally{clearTimeout(timer);}
  }
  async function firstAvailable(urls){let lastError;for(const url of urls){try{return await fetchJson(url);}catch(error){lastError=error;}}throw lastError||new Error('No source available');}
  function cleanName(filename){return filename.replace(IMAGE_EXT,'').replace(/[_.-]+/g,' ').replace(/\s+/g,' ').trim();}
  function imageUrl(path){return RAW+path.split('/').map(encodeURIComponent).join('/');}
  function itemFromImage(file,index){
    const filename=file.filename, lower=filename.toLowerCase(), isWeapon=file.path.startsWith('img/weapon/') || /^weapon_/i.test(filename);
    const isGlove=/glove|handwear|sport gloves|driver gloves|specialist gloves|moto gloves|wraps/i.test(lower);
    const kind=isWeapon?'weapons':(isGlove?'gloves':'agents'), name=cleanName(filename);
    return {kind,name,weapon:isWeapon?name.split(' ').slice(0,2).join(' ').toUpperCase():(isGlove?'GLOVES':'AGENT / SKIN'),image:file.path,imagePath:file.path,id:'file-'+index+'-'+filename,weapon_defindex:'',paint:'',model:'',team:''};
  }
  function itemFilename(item){return String(item&&item.image||'').split('/').pop().toLowerCase();}

  async function load(){
    const treeUrl=API+'/git/trees/'+encodeURIComponent(BRANCH)+'?recursive=1';
    const sources=await Promise.allSettled([
      firstAvailable([RAW+'data/skins_en.json',GITHACK+'data/skins_en.json']),
      firstAvailable([RAW+'data/agents_en.json',GITHACK+'data/agents_en.json']),
      firstAvailable([RAW+'data/gloves_en.json',GITHACK+'data/gloves_en.json']),
      fetchJson(treeUrl)
    ]);
    const sourceErrors=sources.map((r,i)=>r.status==='rejected'?{source:['weapon names','agent names','glove names','image folder scan'][i],message:String(r.reason)}:null).filter(Boolean);
    const tree=sources[3].status==='fulfilled'&&Array.isArray(sources[3].value.tree)?sources[3].value.tree:[];
    const imageFiles=tree.filter(f=>f.type==='blob'&&IMAGE_EXT.test(f.path)&&IMAGE_DIRS.some(dir=>f.path.startsWith(dir))).map(f=>({path:f.path,filename:f.path.split('/').pop(),name:cleanName(f.path.split('/').pop()),url:imageUrl(f.path),category:f.path.startsWith('img/weapon/')?'weapon':'skin'}));
    const weapons=sources[0].status==='fulfilled'&&Array.isArray(sources[0].value)?sources[0].value.slice():[];
    const agents=sources[1].status==='fulfilled'&&Array.isArray(sources[1].value)?sources[1].value.slice():[];
    const gloves=sources[2].status==='fulfilled'&&Array.isArray(sources[2].value)?sources[2].value.slice():[];
    // Add every image that the official JSON catalog does not already reference.
    const known=new Set([...weapons,...agents,...gloves].map(itemFilename).filter(Boolean));
    imageFiles.forEach((file,index)=>{
      if(known.has(file.filename.toLowerCase()))return;
      const item=itemFromImage(file,index);
      if(item.kind==='weapons'){item.weapon_name=item.weapon.toLowerCase().replace(/\s+/g,'_');item.paint_name=item.name;weapons.push(item);}
      else if(item.kind==='gloves'){item.agent_name=item.name;gloves.push(item);}
      else{item.agent_name=item.name;agents.push(item);}
      known.add(file.filename.toLowerCase());
    });
    return {weapons,agents,gloves,imageFiles,sourceErrors};
  }
  window.FragCitySkinBackend=Object.freeze({load});
})();