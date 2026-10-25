(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const preview = /raw\.githack\.com|github\.io|github\.com$/.test(location.hostname);
  const routes = {buyserveropen:'servers.html',buyserver:'servers.html',servers:'servers.html',servers_vps:'manage.html',skins:'skins.html',weaponpaints:'skins.html',usermanual:'guides.html',support:'support.html',overview:'manage.html',login:'account.html',register:'account.html',forgot_password:'account.html',reset_password:'account.html',profile:'account.html',wallet:'account.html',donations:'account.html',vip:'account.html',leaderboard:'account.html',banlist:'account.html',rules:'guides.html',privacy:'guides.html',about:'index.html'};
  // Short branded FRAG CITY transition (visual only).
  if (!document.getElementById('fc-boot')) {
    const boot = document.createElement('div');
    boot.id = 'fc-boot';
    boot.innerHTML = '<div class="fc-boot-mark">F<span>C</span></div><div class="fc-boot-name">FRAG<span>CITY</span></div><div class="fc-boot-track"><i></i></div>';
    boot.setAttribute('role', 'status');
    boot.setAttribute('aria-label', 'Loading FRAG CITY');
    document.body.appendChild(boot);
    const finish = () => { boot.classList.add('fc-boot-out'); window.setTimeout(() => boot.remove(), 240); };
    window.setTimeout(finish, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 430);
  }

  // Never navigate to a PHP source file from a static frontend. The PHP backend
  // must be deployed separately and configured through FRAGCITY_BACKEND_URL.
  const backendBase = () => String(
    window.FRAGCITY_BACKEND_URL ||
    $('meta[name="fragcity-backend-url"]')?.content ||
    ''
  ).trim();

  $$('[data-backend-href]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = a.getAttribute('data-backend-href') || '';
      const page = (target.match(/[?&]page=([^&]+)/) || [,''])[1];
      const labels = {login:'ورود',register:'ثبت‌نام',forgot_password:'بازیابی رمز عبور',profile:'پروفایل',wallet:'کیف پول',donations:'پرداخت‌ها و حمایت مالی',vip:'عضویت VIP',leaderboard:'جدول رتبه‌بندی',banlist:'لیست بن‌ها',rules:'قوانین',privacy:'حریم خصوصی',about:'درباره ما',usermanual:'راهنمای کاربر',support:'پشتیبانی و تیکت‌ها',servers_vps:'سرورهای ثبت‌شده',skins:'مدیریت اسکین',overview:'پنل مدیریت سرور',buyserveropen:'خرید سرور'};
      const label = labels[decodeURIComponent(page)] || 'این قابلیت';
      // On the real PHP site, use the same site's root by default.
      // Static previews (GitHub Pages/raw.githack) still require an explicitly
      // configured FRAGCITY_BACKEND_URL and never attempt to open PHP source.
      const configuredBase = backendBase();
      const base = configuredBase || (!preview ? new URL('../', window.location.href).href : '');

      if (!base) {
        toast('برای انتخاب و ذخیره اسکین باید بک‌اند PHP فعال باشد. این پیش‌نمایش استاتیک است؛ آدرس سایت PHP را در FRAGCITY_BACKEND_URL تنظیم کن.');
        return;
      }

      try {
        const baseUrl = new URL(base, window.location.href);
        if (!/^https?:$/.test(baseUrl.protocol)) throw new Error('Invalid backend protocol');
        const cleanTarget = target.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
        const destination = new URL(cleanTarget, baseUrl.href.endsWith('/') ? baseUrl.href : baseUrl.href + '/');
        if (destination.origin !== baseUrl.origin) throw new Error('Cross-origin backend route rejected');
        window.location.assign(destination.href);
      } catch (error) {
        toast('آدرس بک‌اند معتبر نیست؛ تنظیم FRAGCITY_BACKEND_URL را بررسی کن.');
      }
    });
  });

  // Legacy PHP links that were not converted to data-backend-href are also
  // blocked in static previews instead of being opened as source text.
  if (preview) {
    $$('a[href*="index.php?page="]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        toast('این لینک PHP باید از مسیر اتصال بک‌اند باز شود.');
      });
    });
  }

  const dict = {
  'Home':'خانه','Servers':'سرورها','Skins':'اسکین‌ها','Guides':'راهنما','Support':'پشتیبانی','Account':'حساب کاربری','Control panel':'پنل مدیریت','COUNTER-STRIKE HOSTING':'میزبانی سرور کانتر','OWN THE ARENA':'صاحب میدان باش',
  'BUILT FOR THE NEXT ROUND':'ساخته‌شده برای راند بعدی','YOUR SERVER.':'سرور تو.','YOUR RULES.':'قوانین تو.','Create your own Counter-Strike arena. Fast setup, clear controls, and room to build your community.':'سرور اختصاصی کانتر خودت را بساز؛ راه‌اندازی آسان، کنترل شفاف و فضایی برای رشد کامیونیتی.',
  'Explore servers':'مشاهده سرورها','How it works':'چطور کار می‌کند','Made for players':'برای پلیرها ساخته شده','From first server to full community':'از اولین سرور تا کامیونیتی کامل','TACTICAL. RELIABLE. YOURS.':'تاکتیکی. قابل‌اعتماد. مال تو.',
  'Pick your setup':'انتخاب تنظیمات','Configure your server':'پیکربندی سرور','Bring your squad':'دعوت از اسکواد','Play your way':'به سبک خودت بازی کن','THE FRAG CITY EDGE':'مزیت فرگ سیتی','LESS SETUP.':'تنظیمات کمتر.','MORE GAME.':'بازی بیشتر.',
  'Tools for server owners, community builders, and players who want their own space.':'ابزارهایی برای صاحبان سرور، سازندگان کامیونیتی و پلیرهایی که فضای اختصاصی می‌خواهند.',
  'Server hosting':'میزبانی سرور','Choose a plan built around your player count and game mode.':'پلنی متناسب با تعداد بازیکن و حالت بازی انتخاب کن.','Browse plans ↗':'مشاهده پلن‌ها ↗','One control hub':'یک مرکز مدیریت','Keep your server tools, settings, and activity in one place.':'ابزارها، تنظیمات و فعالیت سرورت را یک‌جا مدیریت کن.',
  'Explore control panel ↗':'ورود به پنل مدیریت ↗','Make it yours':'شخصی‌سازی کن','Discover skins and customization ideas for your server community.':'اسکین‌ها و ایده‌های شخصی‌سازی کامیونیتی سرورت را ببین.','Explore skins ↗':'مشاهده اسکین‌ها ↗',
  'READY WHEN YOU ARE':'هر وقت آماده‌ای','THE NEXT ROUND':'راند بعدی','STARTS':'شروع می‌شود','Find your server':'سرور خودت را پیدا کن','Community first. Built for Counter-Strike.':'کامیونیتی در اولویت؛ ساخته‌شده برای کانتر.',
  'CHOOSE YOUR ARENA':'میدان خودت را انتخاب کن','SERVER':'سرور','PLANS.':'پلن‌ها.','The cards below are design examples only. For actual availability, current pricing, configuration, and checkout, continue to the existing FragCity PHP purchase flow.':'کارت‌های زیر نمونه طراحی هستند. برای موجودی، قیمت واقعی، تنظیمات و پرداخت، وارد بخش خرید اصلی فرگ سیتی شو.',
  'STARTER':'شروع','Entry':'پایه','For friend groups and first-time server owners.':'برای گروه دوستان و صاحبان سرور تازه‌کار.','/ month*':'/ ماه*','Up to 10 player slots*':'تا ۱۰ اسلات بازیکن*','Basic configuration':'تنظیمات پایه','Community support':'پشتیبانی کامیونیتی','Control panel access':'دسترسی به پنل مدیریت',
  'Select plan ↗':'انتخاب پلن ↗','MOST POPULAR':'محبوب‌ترین','Competitive':'رقابتی','For teams, scrims, and growing communities.':'برای تیم‌ها، تمرین‌ها و کامیونیتی‌های در حال رشد.','Up to 20 player slots*':'تا ۲۰ اسلات بازیکن*','Advanced server settings':'تنظیمات پیشرفته سرور','Priority support queue':'صف پشتیبانی اولویت‌دار','Backup options*':'امکانات پشتیبان‌گیری*','COMMUNITY':'کامیونیتی','War Room':'اتاق جنگ','For established communities and events.':'برای کامیونیتی‌های بزرگ و رویدادها.','Up to 32 player slots*':'تا ۳۲ اسلات بازیکن*','Expanded configuration':'تنظیمات گسترده‌تر','Community-focused support':'پشتیبانی ویژه کامیونیتی','Extra management tools*':'ابزارهای مدیریتی بیشتر*',
  'Preview prices are not offers. Live prices, node availability, player slots, map, tickrate, duration, and wallet checkout are handled by the existing backend.':'قیمت‌های نمایشی پیشنهاد فروش نیستند. قیمت و موجودی واقعی، اسلات‌ها، نقشه، تیک‌ریت، مدت و پرداخت توسط بک‌اند مدیریت می‌شوند.',
  'Open live server configuration ↗':'بازکردن تنظیمات واقعی سرور ↗','View registered servers ↗':'مشاهده سرورهای ثبت‌شده ↗','Plans are subject to availability.':'پلن‌ها به موجودی بستگی دارند.',
  'OWNER ACCESS / BACKEND LINK':'دسترسی مالک / اتصال بک‌اند','Open real CS2 control panel ↗':'ورود به پنل واقعی CS2 ↗','CONTROL.':'مدیریت.','Use the existing authenticated FragCity CS2 panel for live server status, console, configuration, files, backups, players, logs, plugins, and admin tools. The visual dashboard below is only a preview.':'برای وضعیت زنده، کنسول، تنظیمات، فایل‌ها، بکاپ‌ها، بازیکنان، لاگ‌ها، پلاگین‌ها و ابزارهای ادمین از پنل اصلی استفاده کن. داشبورد پایین فقط پیش‌نمایش است.',
  'YOUR SERVER / FC-001':'سرور شما / FC-001','Competitive Arena':'میدان رقابتی','DEMO STATUS':'وضعیت نمایشی','SERVER STATUS':'وضعیت سرور','Connect live API':'اتصال API زنده','PLAYERS':'بازیکنان','Example display':'نمایش نمونه','REGION':'منطقه','Placeholder':'نمونه','Quick actions':'دستورات سریع','DEMO ONLY':'فقط نمایشی','Start server':'روشن‌کردن سرور','Restart':'راه‌اندازی مجدد','Stop server':'خاموش‌کردن سرور',
  'These controls do not send commands to a real server. Connect permission-checked backend routes before enabling production actions.':'این کنترل‌ها به سرور واقعی فرمان نمی‌فرستند. پیش از استفاده واقعی، مسیرهای بک‌اند با بررسی مجوز باید متصل شوند.',
  'Console preview':'پیش‌نمایش کنسول','READ-ONLY MOCK':'نمونه فقط‌خواندنی','Dashboard loaded.':'داشبورد بارگذاری شد.','Waiting for authenticated server API…':'در انتظار API احراز هویت‌شده سرور…','No live server data is connected.':'داده زنده‌ای از سرور متصل نیست.',
  'CUSTOMIZE YOUR LOADOUT':'شخصی‌سازی لوداوت','SKIN':'اسکین','LAB.':'آزمایشگاه.','The cards below are visual samples. Open the existing FragCity weapon-paints page to use its real account checks and skin-management flow.':'کارت‌های زیر نمونه تصویری هستند. برای مدیریت واقعی اسکین، صفحه اصلی اسکین‌ها را باز کن.',
  'Open real skin management ↗':'ورود به مدیریت واقعی اسکین ↗','All weapons':'همه سلاح‌ها','Rifles':'رایفل‌ها','Pistols':'تپانچه‌ها','Snipers':'اسنایپرها','RIFLE / SAMPLE':'رایفل / نمونه','Redline Concept':'طرح ردلاین','Graphic placeholder artwork':'تصویر نمونه گرافیکی','Preview choice ↗':'پیش‌نمایش انتخاب ↗','SNIPER / SAMPLE':'اسنایپر / نمونه','Frostbite Concept':'طرح فراست‌بایت','PISTOL / SAMPLE':'تپانچه / نمونه','Gold Circuit':'مدار طلایی','Violet Pulse':'نبض بنفش',
  'To apply a skin in-game, the backend must confirm the player\'s identity, server compatibility, and permitted cosmetic system. This page currently only previews selection.':'برای اعمال اسکین داخل بازی، بک‌اند باید هویت بازیکن و سازگاری سرور را بررسی کند. این صفحه فعلاً فقط پیش‌نمایش است.','Cosmetic choices depend on server support.':'اسکین‌ها به پشتیبانی سرور بستگی دارند.',
  'FIELD MANUAL':'راهنمای میدانی','GET IN.':'وارد شو.','SET UP.':'راه‌اندازی کن.','A straightforward route from choosing a plan to playing with your squad.':'از انتخاب پلن تا بازی با اسکواد، مرحله‌به‌مرحله.',
  'Choose a server plan':'انتخاب پلن سرور','Pick a plan based on expected player slots, region, and game mode. Confirm current price and availability before checkout.':'بر اساس تعداد بازیکنان، منطقه و حالت بازی پلن را انتخاب کن. قبل از پرداخت، قیمت و موجودی را بررسی کن.',
  'View plans ↗':'مشاهده پلن‌ها ↗','Configure your arena':'پیکربندی میدان','Set the server name, map rotation, player limit, and supported plugins through the owner panel.':'نام سرور، چرخش نقشه، محدودیت بازیکنان و پلاگین‌ها را از پنل تنظیم کن.',
  'Open panel preview ↗':'بازکردن پیش‌نمایش پنل ↗','Invite your squad':'دعوت از اسکواد','Share the server address only after it is provisioned and its network access has been verified.':'آدرس سرور را پس از آماده‌سازی و بررسی شبکه به اشتراک بگذار.',
  'Need help? ↗':'کمک لازم داری؟ ↗','Keep it running smoothly':'سرور را روان نگه دار','Use backups, sensible permissions, and up-to-date server software. Keep panel and agent credentials private.':'از بکاپ، مجوزهای درست و نرم‌افزار به‌روز استفاده کن. اطلاعات ورود پنل را محرمانه نگه دار.',
  'Contact support ↗':'تماس با پشتیبانی ↗','Good setups make better matches.':'تنظیم خوب، بازی بهتر می‌سازد.',
  'WE\'VE GOT YOUR BACK':'کنارت هستیم','NEED A':'کمک','HAND?':'لازم داری؟','Use the existing FragCity support page for its account-aware ticket submission and ticket history. The form below is only a design preview.':'برای ثبت تیکت واقعی و دیدن تاریخچه، صفحه پشتیبانی اصلی را باز کن. فرم زیر فقط پیش‌نمایش طراحی است.',
  'Open real support & tickets ↗':'ورود به پشتیبانی و تیکت‌ها ↗','Stay focused':'روی بازی تمرکز کن','on the':'روی','match.':'مچ.','For account, billing, server setup, or gameplay configuration questions, prepare your server ID and a short description of the issue. Never include passwords or API secrets in a support request.':'برای پرسش درباره حساب، پرداخت یا سرور، شناسه سرور و شرح کوتاه مشکل را آماده کن. رمز عبور یا کلید API را در تیکت ننویس.',
  'Be specific':'دقیق توضیح بده','Include the error and when it started.':'خطا و زمان شروع آن را بنویس.','Keep it secure':'امنیت را حفظ کن','Do not share login credentials.':'اطلاعات ورود را به اشتراک نگذار.','Your name':'نام شما','Email address':'ایمیل','Topic':'موضوع','Server setup':'راه‌اندازی سرور','Billing':'پرداخت','Account access':'دسترسی به حساب','Technical issue':'مشکل فنی','Other':'سایر','How can we help?':'چطور می‌توانیم کمک کنیم؟','Preview ticket':'پیش‌نمایش تیکت','Demo only — no data is transmitted.':'فقط نمایشی — هیچ داده‌ای ارسال نمی‌شود.','Support should always be secure.':'پشتیبانی باید همیشه امن باشد.'
  };
  const reverse = Object.fromEntries(Object.entries(dict).map(([en,fa])=>[fa,en]));
  const originalNodes = new WeakMap(), originalPlaceholders = new WeakMap();
  let fa = false;
  const originalTitle = document.title;
  const style = document.createElement('style');
  style.textContent = '.language-toggle{display:inline-flex;align-items:center;gap:9px;margin-left:10px;padding:10px 13px;border:1px solid #693039;background:linear-gradient(135deg,#2a171b,#17171b);color:#fff;font-size:10px;font-weight:800;letter-spacing:1px;cursor:pointer;border-radius:3px;box-shadow:0 0 22px #f0444b12;transition:.2s;white-space:nowrap}.language-toggle:hover{border-color:#f0444b;box-shadow:0 0 24px #f0444b2c;transform:translateY(-1px)}.language-toggle span{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#f0444b;color:#fff;font-size:10px}.toast{position:fixed;z-index:9999;bottom:24px;left:50%;transform:translateX(-50%);max-width:90vw;padding:14px 20px;background:#17171c;border:1px solid #f0444b;color:#fff;box-shadow:0 12px 50px #0009;font-size:12px;border-radius:4px}html[dir=rtl] body{font-family:Tahoma,Arial,sans-serif}html[dir=rtl] .topbar,html[dir=rtl] nav,html[dir=rtl] .hero,html[dir=rtl] .section-head,html[dir=rtl] .cta,html[dir=rtl] footer{direction:rtl}html[dir=rtl] .hero-copy,html[dir=rtl] .section-head>div,html[dir=rtl] .feature-card,html[dir=rtl] .inner-page,html[dir=rtl] .plan,html[dir=rtl] .support-form,html[dir=rtl] .dash-main,html[dir=rtl] .dash-nav{text-align:right}html[dir=rtl] .hero-art{direction:ltr}html[dir=rtl] .plan li:before{margin-right:0;margin-left:10px}html[dir=rtl] .dash-nav .dash-active{border-left:0;border-right:2px solid var(--red)}html[dir=rtl] .notice{border-left:0;border-right:2px solid var(--red)}@media(max-width:760px){.language-toggle{margin-left:0;padding:8px 10px}}';
  document.head.appendChild(style);
  const header=$('.topbar');
  if(header&&!$('.language-toggle')){const b=document.createElement('button');b.type='button';b.className='language-toggle';b.innerHTML='<span>فا</span> فارسی';b.setAttribute('aria-label','Switch website language');b.addEventListener('click',()=>setLanguage(!fa));const c=$('.button-small',header);if(c)c.insertAdjacentElement('afterend',b);else header.appendChild(b);}
  function setLanguage(value){
    fa=value;document.documentElement.lang=fa?'fa':'en';document.documentElement.dir=fa?'rtl':'ltr';
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
    while(n=walker.nextNode()){if(!originalNodes.has(n))originalNodes.set(n,n.nodeValue);const original=originalNodes.get(n);const key=original.replace(/\s+/g,' ').trim();if(fa&&dict[key]){const lead=original.match(/^\s*/)?.[0]||'',tail=original.match(/\s*$/)?.[0]||'';n.nodeValue=lead+dict[key]+tail;}else if(!fa)n.nodeValue=original;}
    $$('input,textarea').forEach(el=>{if(!originalPlaceholders.has(el))originalPlaceholders.set(el,el.getAttribute('placeholder'));const p=originalPlaceholders.get(el);if(fa&&p)el.setAttribute('placeholder',dict[p]||p);else if(!fa&&p!==null)el.setAttribute('placeholder',p);});
    const b=$('.language-toggle');if(b)b.innerHTML=fa?'<span>EN</span> English':'<span>فا</span> فارسی';
    document.title=fa?'فرگ سیتی — صاحب میدان باش':originalTitle;
    try{localStorage.setItem('fragcity-language',fa?'fa':'en')}catch(e){}
  }
  const nav=$('nav'),menu=$('.menu-toggle');if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
  function toast(message){const old=$('.toast');if(old)old.remove();const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.remove(),4200);}
  $$('.choose-plan').forEach(b=>b.addEventListener('click',()=>{if(preview)toast(fa?'برای خرید واقعی باید سایت روی سرور PHP اجرا شود؛ این لینک فقط پیش‌نمایش است.':'Live checkout needs the PHP site; this is a static preview.');else location.href='../index.php?page=buyserveropen';}));
  $$('.demo-action').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.action;const en={start:'Preview only: connect a protected server API to start the server.',restart:'Preview only: connect a protected server API to restart the server.',stop:'Preview only: connect a protected server API to stop the server.'};const faText={start:'این فقط پیش‌نمایش است؛ برای روشن‌کردن سرور باید API امن متصل شود.',restart:'این فقط پیش‌نمایش است؛ برای راه‌اندازی مجدد باید API امن متصل شود.',stop:'این فقط پیش‌نمایش است؛ برای خاموش‌کردن سرور باید API امن متصل شود.'};toast((fa?faText:en)[a]);}));
  // Browse every skin image tracked in this repository with a tree-style category menu.
  const skinGrid=$('#skin-grid');
  if(skinGrid){
    const catalogUrl=new URL('assets/data/all-skins.json',document.baseURI).href;
    const search=$('#skin-search'),sort=$('#skin-sort'),prev=$('#skin-prev'),next=$('#skin-next');
    let stickerSlot=0,stickerSlots=[null,null,null,null];
    const pageSize=48;let catalog=[],page=0,category='all',weaponChoice='all',visible=[];
    const treeLabels={rifles:'Rifles',pistols:'Pistols',snipers:'Snipers',smgs:'SMGs',shotguns:'Shotguns',machineguns:'Machine guns',utility:'Knives',gloves:'Gloves',agents:'Agents',stickers:'Stickers',charms:'Charms',music:'Music Kits',collectibles:'Collectibles'};
    const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const imageUrl=s=>{if(s?.imageFound===false&&s?.weaponLabel&&s?.name){const finish=String(s.name).split('|').pop().trim();return 'https://specs.gg/assets/img/cs2_skins/'+encodeURIComponent(String(s.weaponLabel).trim())+'/'+encodeURIComponent(finish)+'.png';}const raw=String(s?.imagePath||s?.image||'');if(!raw)return '';if(/^https?:\/\//i.test(raw)||raw.startsWith('data:'))return raw;const path=raw.startsWith('img/')?raw:('img/skins/'+raw.split('/').pop());return new URL('../'+path,document.baseURI).href};
    const getWeaponChoices=cat=>[...new Set(catalog.filter(s=>s.category===cat).map(s=>s.weaponLabel||s.weapon||'Other'))].sort((a,b)=>a.localeCompare(b));
    const mainCategory=s=>s.category;
    function buildTree(){
      for(const [cat,label] of Object.entries(treeLabels)){
        const host=$(`[data-tree-children="${cat}"]`);if(!host)continue;
        const choices=getWeaponChoices(cat);
        if(!choices.length){host.innerHTML='<button class="skin-tree-leaf" type="button" data-tree-select="all">All items</button>';continue;}
        host.innerHTML='<button class="skin-tree-leaf active" type="button" data-tree-select="'+esc(cat)+'" data-weapon-choice="all">All '+esc(label.toLowerCase())+' <span>'+catalog.filter(s=>s.category===cat).length.toLocaleString()+'</span></button>'+choices.map(w=>'<button class="skin-tree-leaf" type="button" data-tree-select="'+esc(cat)+'" data-weapon-choice="'+esc(w)+'">'+esc(w)+' <span>'+catalog.filter(s=>s.category===cat&&(s.weaponLabel||s.weapon||'Other')===w).length.toLocaleString()+'</span></button>').join('');
      }
    }
    function render(){
      const q=(search?.value||'').trim().toLocaleLowerCase();
      visible=catalog.filter(s=>(category==='all'?true:s.category===category)&&(weaponChoice==='all'||(s.weaponLabel||s.weapon||'Other')===weaponChoice)&&(!q||s.name.toLocaleLowerCase().includes(q)||(s.weapon||'').toLocaleLowerCase().includes(q)||String(s.paint).includes(q)));
      const order=sort?.value||'name';
      visible.sort((a,b)=>order==='weapon'?(a.weaponLabel||a.weapon).localeCompare(b.weaponLabel||b.weapon)||a.name.localeCompare(b.name):order==='paint'?Number(a.paint)-Number(b.paint):a.name.localeCompare(b.name));
      const pages=Math.max(1,Math.ceil(visible.length/pageSize));page=Math.min(page,pages-1);
      skinGrid.innerHTML=visible.slice(page*pageSize,(page+1)*pageSize).map(s=>'<article class="skin-card" data-type="'+esc(s.category)+'" data-skin-name="'+esc(s.name)+'" data-weapon="'+esc(s.weapon)+'" data-paint="'+esc(s.paint)+'" data-image="'+esc(s.image)+'" data-image-path="'+esc(s.imagePath||'')+'" data-image-found="'+(s.imageFound===false?'false':'true')+'"><div class="skin-image"><img src="'+esc(imageUrl(s))+'" alt="'+esc(s.name)+'" loading="lazy" decoding="async" onerror="this.onerror=null;this.style.display=\'none\';this.parentElement.classList.add(\'image-missing\')"></div><div class="skin-card-info"><small>'+esc(s.weaponLabel||s.categoryLabel||s.weapon)+'</small><h3>'+esc(s.name)+'</h3><p>Paint / item ID: '+esc(s.paint)+'</p><button class="button button-ghost select-skin" type="button">Select item</button></div></article>').join('');
      const totalNode=$('#skin-total');if(totalNode)totalNode.textContent=catalog.length.toLocaleString();
      $('#skin-results-count').textContent=visible.length.toLocaleString()+' items';
      $('#skin-page-number').textContent='Page '+(page+1)+' / '+pages;
      prev.disabled=page===0;next.disabled=page>=pages-1;
      const selected=localStorage.getItem('fragcity-selected-skin');
      if(selected){try{const s=JSON.parse(selected);const c=$$('.skin-card').find(x=>x.dataset.skinName===s.name);if(c)c.classList.add('skin-selected');}catch(e){}}
    }
    function renderStickerSlots(){
      const host=$('#preview-stickers');if(!host)return;
      host.innerHTML=stickerSlots.map((s,i)=>'<button type="button" class="preview-sticker '+(i===stickerSlot?'active':'')+'" data-slot="'+i+'">'+(s?'<img src="'+esc(imageUrl(s))+'" alt="'+esc(s.name)+'">':('Sticker slot '+(i+1)))+'</button>').join('');
    }
    try{stickerSlots=JSON.parse(localStorage.getItem('fragcity-sticker-slots')||'[null,null,null,null]');}catch(e){}
    $('.sticker-slot').forEach(b=>b.addEventListener('click',()=>{stickerSlot=Number(b.dataset.slot);$('.sticker-slot').forEach(x=>x.classList.toggle('active',x===b));renderStickerSlots();}));
    $('#preview-stickers')?.addEventListener('click',e=>{const b=e.target.closest('[data-slot]');if(!b)return;stickerSlot=Number(b.dataset.slot);$('.sticker-slot').forEach(x=>x.classList.toggle('active',Number(x.dataset.slot)===stickerSlot));renderStickerSlots();});
    $('#clear-sticker-slot')?.addEventListener('click',()=>{stickerSlots[stickerSlot]=null;try{localStorage.setItem('fragcity-sticker-slots',JSON.stringify(stickerSlots));}catch(e){}renderStickerSlots();});
    $('#clear-charm')?.addEventListener('click',()=>{try{localStorage.removeItem('fragcity-selected-charm');}catch(e){}if($('#selected-charm-name'))$('#selected-charm-name').textContent='No charm selected';});
    $('#close-customizer')?.addEventListener('click',()=>{const panel=$('#loadout-customizer');if(panel)panel.hidden=true;});
    try{const charm=JSON.parse(localStorage.getItem('fragcity-selected-charm')||'null');if(charm&&$('#selected-charm-name'))$('#selected-charm-name').textContent=charm.name;}catch(e){}
    $('#customizer-type')?.addEventListener('change',e=>{category=e.target.value;weaponChoice='all';page=0;const root=$(`[data-tree-root="${category}"]`);root?.click();render();});
    $('#save-loadout')?.addEventListener('click',()=>{try{localStorage.setItem('fragcity-visual-loadout',JSON.stringify({selected:JSON.parse(localStorage.getItem('fragcity-selected-skin')||'null'),stickers:stickerSlots}));toast(fa?'لوداوت ظاهری در مرورگر ذخیره شد.':'Visual loadout saved in this browser.');}catch(e){toast('Could not save loadout.');}});
    renderStickerSlots();
    async function loadCatalog(){
      const response=await fetch(catalogUrl,{cache:'no-store'});
      if(!response.ok)throw new Error('Skin catalog HTTP '+response.status);
      const data=await response.json();
      if(!Array.isArray(data)||!data.length)throw new Error('Skin catalog is empty');
      if(window.FragCitySkinBackend&&typeof window.FragCitySkinBackend.loadCatalog==='function'){
        try{catalog=await window.FragCitySkinBackend.loadCatalog(catalogUrl,data);}catch(scanError){console.warn('Repository image scan unavailable; using catalog image paths:',scanError);catalog=data.filter(s=>s.name&&s.image&&s.category).map(s=>({...s,imagePath:String(s.image).startsWith('img/')?s.image:'img/skins/'+String(s.image).split('/').pop()}));}
      }else{catalog=data.filter(s=>s.name&&s.image&&s.category).map(s=>({...s,imagePath:String(s.image).startsWith('img/')?s.image:'img/skins/'+String(s.image).split('/').pop()}));}
      if(!catalog.length)throw new Error('No usable skin entries');
      buildTree();render();
      try{
        const saved=JSON.parse(localStorage.getItem('fragcity-selected-skin')||'null');
        if(saved){
          if($('#selected-skin-id'))$('#selected-skin-id').value=saved.paint||'';
          if($('#selected-weapon'))$('#selected-weapon').value=saved.weapon||'';
          if($('#customizer-weapon-name'))$('#customizer-weapon-name').textContent=saved.name||'';
          if($('#customizer-weapon-meta'))$('#customizer-weapon-meta').textContent=(saved.weapon||'')+' · Paint ID '+(saved.paint||'');
          if($('#customizer-weapon-image'))$('#customizer-weapon-image').src=imageUrl(saved);
          const panel=$('#loadout-customizer');if(panel)panel.hidden=false;
          if($('#customizer-type'))$('#customizer-type').value=saved.type||'rifles';
        }
      }catch(e){}
    }
    loadCatalog().catch(err=>{
      $('#skin-results-count').textContent='Catalog could not load. Check your connection and refresh.';
      console.error('FragCity skin catalog failed:',err);
    });
    $$('.skin-tree-node').forEach(b=>b.addEventListener('click',()=>{
      const cat=b.dataset.treeRoot;
      if(cat==='all'){category='all';weaponChoice='all';$$('.skin-tree-node').forEach(x=>{x.classList.remove('active');if(x!==b)x.setAttribute('aria-expanded','false');});$$('.skin-tree-children').forEach(x=>x.hidden=true);b.classList.add('active');}
      else{
        const host=$(`[data-tree-children="${cat}"]`),expanded=b.getAttribute('aria-expanded')==='true';
        $('.skin-tree-children').forEach(x=>{if(x!==host)x.hidden=true;});
        $('.skin-tree-node').forEach(x=>{if(x!==b)x.setAttribute('aria-expanded','false');x.classList.toggle('active',x===b);});
        b.setAttribute('aria-expanded',String(!expanded));if(host)host.hidden=expanded;
        category=cat;weaponChoice='all';
        if(host&&!expanded){host.querySelectorAll('.skin-tree-leaf').forEach(x=>x.classList.remove('active'));host.querySelector('[data-weapon-choice="all"]')?.classList.add('active');}
      }
      page=0;render();
    }));
    $('#skin-tree')?.addEventListener('click',e=>{
      const leaf=e.target.closest('[data-tree-select]');if(!leaf)return;
      category=leaf.dataset.treeSelect;weaponChoice=leaf.dataset.weaponChoice||'all';page=0;
      const parent=leaf.closest('.skin-tree-children');
      if(parent){parent.querySelectorAll('.skin-tree-leaf').forEach(x=>x.classList.toggle('active',x===leaf));const cat=parent.dataset.treeChildren;$$('.skin-tree-node').forEach(x=>x.classList.toggle('active',x.dataset.treeRoot===cat));}
      else{$$('.skin-tree-node').forEach(x=>x.classList.toggle('active',x.dataset.treeRoot==='all'));}
      render();
    });
    search?.addEventListener('input',()=>{page=0;render();});sort?.addEventListener('change',()=>{page=0;render();});
    prev?.addEventListener('click',()=>{if(page>0){page--;render();skinGrid.scrollIntoView({behavior:'smooth',block:'start'});}});
    next?.addEventListener('click',()=>{if((page+1)*pageSize<visible.length){page++;render();skinGrid.scrollIntoView({behavior:'smooth',block:'start'});}});
    skinGrid.addEventListener('click',e=>{
      const b=e.target.closest('.select-skin');if(!b)return;const card=b.closest('.skin-card');if(!card)return;
      $$('.skin-card').forEach(c=>c.classList.remove('skin-selected'));card.classList.add('skin-selected');
      const item={name:card.dataset.skinName,weapon:card.dataset.weapon,paint:card.dataset.paint,image:card.dataset.image,imagePath:card.dataset.imagePath,imageFound:card.dataset.imageFound!=='false',type:card.dataset.type};
      if($('#selected-skin-id'))$('#selected-skin-id').value=item.paint;
      if($('#selected-weapon'))$('#selected-weapon').value=item.weapon;
      if(item.type==='stickers'||item.type==='charms'){
        if(item.type==='charms'){
          try{localStorage.setItem('fragcity-selected-charm',JSON.stringify(item));}catch(e){}
          if($('#selected-charm-name'))$('#selected-charm-name').textContent=item.name;
          toast(fa?'چارم انتخاب شد.':'Charm selected.');
        }else{
          stickerSlots[stickerSlot]=item;
          try{localStorage.setItem('fragcity-sticker-slots',JSON.stringify(stickerSlots));}catch(e){}
          renderStickerSlots();
          toast(fa?'استیکر به اسلات انتخابی اضافه شد.':'Sticker assigned to selected slot.');
        }
      }else{
        if($('#selected-skin-name'))$('#selected-skin-name').textContent=item.name;
        if($('#selected-skin-meta'))$('#selected-skin-meta').textContent=item.weapon+' · Paint ID '+item.paint;
        if($('#customizer-weapon-name'))$('#customizer-weapon-name').textContent=item.name;
        if($('#customizer-weapon-meta'))$('#customizer-weapon-meta').textContent=item.weapon+' · Paint ID '+item.paint;
        if($('#customizer-weapon-image'))$('#customizer-weapon-image').src=imageUrl(item);
        const panel=$('#loadout-customizer');if(panel)panel.hidden=false;
        if($('#customizer-type'))$('#customizer-type').value=item.type;
        try{localStorage.setItem('fragcity-selected-skin',JSON.stringify(item));}catch(e){}
        toast(fa?'انتخاب برای شخصی‌سازی ذخیره شد.':'Selected item added to the visual customizer.');
      }
    });
  }
  const apiInput=$('#api-base-url');if(apiInput){try{apiInput.value=localStorage.getItem('fragcity-api-base')||'';}catch(e){}apiInput.addEventListener('change',()=>{try{localStorage.setItem('fragcity-api-base',apiInput.value.trim());}catch(e){}});}
  const applySkin=$('#apply-skin');
  if(applySkin)applySkin.addEventListener('click',async()=>{
    const id=$('#selected-skin-id')?.value||'';
    const weapon=$('#selected-weapon')?.value||'';
    const server=$('#server-id')?.value.trim()||'';
    let selectedItem=null;
    try{selectedItem=JSON.parse(localStorage.getItem('fragcity-selected-skin')||'null');}catch(e){}
    if(!selectedItem||!id){toast(fa?'اول یک اسکین انتخاب کن.':'Choose a skin first.');return;}
    if(!server){toast(fa?'شناسه یا آدرس سرور را وارد کن.':'Enter your server ID or address.');$('#server-id')?.focus();return;}
    const apiBase=($('#api-base-url')?.value||'').trim().replace(/\/$/,'');
    if(!apiBase){toast(fa?'انتخاب ثبت شد، اما API اعمال اسکین هنوز در بک‌اند تنظیم نشده؛ اسکین داخل بازی تغییر نکرد.':'Selection saved, but the backend apply-skin API is not configured. The in-game skin has NOT changed.');return;}
    applySkin.disabled=true;
    const old=applySkin.textContent;applySkin.textContent=fa?'در حال ارسال…':'Applying…';
    try{
      const response=await fetch(apiBase+'/api/skins/apply',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({server_id:server,weapon,paint_id:id,skin_name:selectedItem.name})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok||data.success===false)throw new Error(data.message||data.error||('HTTP '+response.status));
      toast(fa?'درخواست اسکین به سرور ارسال شد.':'Skin request sent to the server.');
    }catch(err){toast((fa?'اعمال اسکین ناموفق بود: ':'Could not apply skin: ')+(err.message||'API error'));}
    finally{applySkin.disabled=false;applySkin.textContent=old;}
  });
  const form=$('#support-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();toast(fa?'این فرم نمایشی است؛ برای ثبت واقعی تیکت، صفحه پشتیبانی اصلی را باز کن.':'This is a preview form. Open the live support page to submit a real ticket.');});
  try{setLanguage(localStorage.getItem('fragcity-language')==='fa')}catch(e){setLanguage(false)}
})();