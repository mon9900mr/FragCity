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

  if (preview) {
    $('[data-backend-href]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = a.getAttribute('data-backend-href') || '';
        const page = (target.match(/[?&]page=([^&]+)/) || [,''])[1];
        const labels = {login:'ورود',register:'ثبت‌نام',forgot_password:'بازیابی رمز عبور',profile:'پروفایل',wallet:'کیف پول',donations:'پرداخت‌ها و حمایت مالی',vip:'عضویت VIP',leaderboard:'جدول رتبه‌بندی',banlist:'لیست بن‌ها',rules:'قوانین',privacy:'حریم خصوصی',about:'درباره ما',usermanual:'راهنمای کاربر',support:'پشتیبانی و تیکت‌ها',servers_vps:'سرورهای ثبت‌شده',skins:'مدیریت اسکین',overview:'پنل مدیریت سرور'};
        const label = labels[decodeURIComponent(page)] || 'این قابلیت';
        toast('پیش‌نمایش استاتیک است؛ برای باز شدن «'+label+'» باید سایت PHP روی هاست اجرا شود. این دکمه در پیش‌نمایش به کد PHP هدایت نمی‌شود.');
      });
    });
    $('a[href*="index.php?page="]').forEach(a => {
      const m = a.href.match(/[?&]page=([^&]+)/);
      if (m && routes[decodeURIComponent(m[1])]) a.href = routes[decodeURIComponent(m[1])];
      else if (m) a.addEventListener('click', e => { e.preventDefault(); toast('این بخش فقط در نسخه اجراشده روی هاست PHP در دسترس است.'); });
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
  const filters=$$('[data-filter]');filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');const type=b.dataset.filter;$$$('.skin-card').forEach(c=>c.hidden=type!=='all'&&c.dataset.type!==type);}));
  $('.select-skin').forEach(b=>b.addEventListener('click',()=>{
    const card=b.closest('.skin-card');
    if(!card)return;
    $$('.skin-card').forEach(c=>c.classList.remove('skin-selected'));
    card.classList.add('skin-selected');
    const selected=$('#selected-skin-name');
    const id=$('#selected-skin-id');
    if(selected)selected.textContent=card.dataset.skinName||card.querySelector('h3')?.textContent||'';
    if(id)id.value=card.dataset.paint||'';
    const weapon=$('#selected-weapon');
    if(weapon)weapon.value=card.dataset.weapon||'';
    const apply=$('#apply-skin');
    if(apply)apply.disabled=false;
    try{localStorage.setItem('fragcity-selected-skin',JSON.stringify({name:card.dataset.skinName,weapon:card.dataset.weapon,paint:card.dataset.paint,image:card.dataset.image}));}catch(e){}
    toast(fa?'اسکین انتخاب شد؛ حالا سرور را وارد کن و اعمال را بزن.':'Skin selected. Choose your server and press Apply skin.');
  }));
  const applySkin=$('#apply-skin');
  if(applySkin)applySkin.addEventListener('click',async()=>{
    const id=$('#selected-skin-id')?.value||'';
    const weapon=$('#selected-weapon')?.value||'';
    const server=$('#server-id')?.value.trim()||'';
    const card=$('.skin-selected');
    if(!card||!id){toast(fa?'اول یک اسکین انتخاب کن.':'Choose a skin first.');return;}
    if(!server){toast(fa?'شناسه یا آدرس سرور را وارد کن.':'Enter your server ID or address.');$('#server-id')?.focus();return;}
    const apiBase=(document.querySelector('meta[name="fragcity-api-base"]')?.content||'').trim().replace(/\/$/,'');
    if(!apiBase){toast(fa?'انتخاب ثبت شد، اما API اعمال اسکین هنوز در بک‌اند تنظیم نشده؛ اسکین داخل بازی تغییر نکرد.':'Selection saved, but the backend apply-skin API is not configured. The in-game skin has NOT changed.');return;}
    applySkin.disabled=true;
    const old=applySkin.textContent;applySkin.textContent=fa?'در حال ارسال…':'Applying…';
    try{
      const response=await fetch(apiBase+'/api/skins/apply',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({server_id:server,weapon,paint_id:id,skin_name:card.dataset.skinName})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok||data.success===false)throw new Error(data.message||data.error||('HTTP '+response.status));
      toast(fa?'درخواست اسکین به سرور ارسال شد.':'Skin request sent to the server.');
    }catch(err){toast((fa?'اعمال اسکین ناموفق بود: ':'Could not apply skin: ')+(err.message||'API error'));}
    finally{applySkin.disabled=false;applySkin.textContent=old;}
  });
  const form=$('#support-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();toast(fa?'این فرم نمایشی است؛ برای ثبت واقعی تیکت، صفحه پشتیبانی اصلی را باز کن.':'This is a preview form. Open the live support page to submit a real ticket.');});
  try{setLanguage(localStorage.getItem('fragcity-language')==='fa')}catch(e){setLanguage(false)}
})();