<?php
/**
 * FragCity homepage — CS2 community and server platform.
 * Live numbers are intentionally omitted until a verified server/API source is connected.
 */
?>
<section class="fc-home" aria-labelledby="fc-home-title">
    <div class="fc-home-grid" aria-hidden="true"></div>
    <div class="fc-home-hero">
        <div class="fc-hero-copy">
            <div class="fc-eyebrow"><span class="fc-pulse"></span><span data-i18n="eyebrow">FRAGCITY · COUNTER-STRIKE 2</span></div>
            <h1 id="fc-home-title"><span data-i18n="heroLine1">Your game.</span><br><span class="fc-gradient" data-i18n="heroLine2">Your servers. Your city.</span></h1>
            <p class="fc-hero-desc" data-i18n="heroDesc">Discover CS2 servers, explore player features, and manage your own game server from one place.</p>
            <div class="fc-hero-actions">
                <a class="fc-btn fc-btn-primary" href="?page=servers_vps" data-ajax-nav data-slug="servers_vps"><i class="fa-solid fa-server"></i><span data-i18n="browseServers">Browse servers</span><i class="fa-solid fa-arrow-up-right-from-square fc-btn-arrow"></i></a>
                <a class="fc-btn fc-btn-secondary" href="?page=buyserveropen" data-ajax-nav data-slug="buyserveropen"><i class="fa-solid fa-rocket"></i><span data-i18n="rentServer">Get a game server</span></a>
            </div>
            <div class="fc-hero-trust"><span><i class="fa-solid fa-shield-halved"></i><span data-i18n="builtFor">Built for CS2 communities</span></span><span><i class="fa-solid fa-sliders"></i><span data-i18n="control">Control from one panel</span></span></div>
        </div>
        <div class="fc-hero-art" aria-label="Counter-Strike inspired abstract artwork">
            <div class="fc-art-glow"></div>
            <div class="fc-art-ring fc-art-ring-one"></div><div class="fc-art-ring fc-art-ring-two"></div>
            <div class="fc-art-crosshair"><span></span><span></span><span></span><span></span><b></b></div>
            <div class="fc-art-tag fc-art-tag-top"><i class="fa-solid fa-bolt"></i> FRAGCITY</div>
            <div class="fc-art-tag fc-art-tag-bottom"><span class="fc-tag-dot"></span><span data-i18n="readyForNext">READY FOR THE NEXT ROUND</span></div>
            <div class="fc-art-number">01</div>
        </div>
    </div>

    <div class="fc-value-strip">
        <div class="fc-value-item"><span class="fc-value-icon"><i class="fa-solid fa-list-ul"></i></span><div><strong data-i18n="serverBrowser">Server browser</strong><span data-i18n="serverBrowserDesc">Find a mode that fits your squad</span></div><i class="fa-solid fa-arrow-up-right-from-square fc-value-arrow"></i></div>
        <div class="fc-value-item"><span class="fc-value-icon"><i class="fa-solid fa-crosshairs"></i></span><div><strong data-i18n="playerTools">Player tools</strong><span data-i18n="playerToolsDesc">Profiles, rankings and game features</span></div><i class="fa-solid fa-arrow-up-right-from-square fc-value-arrow"></i></div>
        <div class="fc-value-item"><span class="fc-value-icon"><i class="fa-solid fa-gamepad"></i></span><div><strong data-i18n="serverControl">Server control</strong><span data-i18n="serverControlDesc">A dedicated space for your server</span></div><i class="fa-solid fa-arrow-up-right-from-square fc-value-arrow"></i></div>
    </div>

    <section class="fc-section" aria-labelledby="fc-discover-title">
        <div class="fc-section-head"><div><span class="fc-section-kicker" data-i18n="explore">EXPLORE FRAGCITY</span><h2 id="fc-discover-title" data-i18n="discoverTitle">Everything starts with a good match.</h2></div><a class="fc-text-link" href="?page=servers_vps" data-ajax-nav data-slug="servers_vps"><span data-i18n="allServers">View server list</span><i class="fa-solid fa-arrow-left"></i></a></div>
        <div class="fc-feature-grid">
            <a class="fc-feature-card fc-card-servers" href="?page=servers_vps" data-ajax-nav data-slug="servers_vps">
                <div class="fc-card-top"><span class="fc-card-icon"><i class="fa-solid fa-satellite-dish"></i></span><span class="fc-card-index">01 / DISCOVER</span></div>
                <div class="fc-card-visual fc-visual-server"><span class="fc-visual-line"></span><span class="fc-visual-line"></span><span class="fc-visual-line"></span><i class="fa-solid fa-server"></i></div>
                <h3 data-i18n="findCommunity">Find your community</h3><p data-i18n="findCommunityDesc">Browse the server directory and choose where to play.</p><span class="fc-card-link"><span data-i18n="exploreServers">Explore servers</span><i class="fa-solid fa-arrow-left"></i></span>
            </a>
            <a class="fc-feature-card fc-card-player" href="?page=leaderboard" data-ajax-nav data-slug="leaderboard">
                <div class="fc-card-top"><span class="fc-card-icon"><i class="fa-solid fa-trophy"></i></span><span class="fc-card-index">02 / COMPETE</span></div>
                <div class="fc-card-visual fc-visual-player"><span class="fc-orbit"></span><i class="fa-solid fa-crosshairs"></i></div>
                <h3 data-i18n="trackProgress">Track your progress</h3><p data-i18n="trackProgressDesc">Open player rankings and discover the community tools.</p><span class="fc-card-link"><span data-i18n="viewRankings">View rankings</span><i class="fa-solid fa-arrow-left"></i></span>
            </a>
            <a class="fc-feature-card fc-card-hosting" href="?page=buyserveropen" data-ajax-nav data-slug="buyserveropen">
                <div class="fc-card-top"><span class="fc-card-icon"><i class="fa-solid fa-cubes-stacked"></i></span><span class="fc-card-index">03 / BUILD</span></div>
                <div class="fc-card-visual fc-visual-hosting"><div class="fc-cube fc-cube-back"></div><div class="fc-cube fc-cube-front"></div><i class="fa-solid fa-terminal"></i></div>
                <h3 data-i18n="launchServer">Launch your own server</h3><p data-i18n="launchServerDesc">Explore server hosting options for your community.</p><span class="fc-card-link"><span data-i18n="viewHosting">View hosting</span><i class="fa-solid fa-arrow-left"></i></span>
            </a>
        </div>
    </section>

    <section class="fc-bottom-cta">
        <div class="fc-cta-mark"><i class="fa-solid fa-bolt"></i></div>
        <div class="fc-cta-copy"><span class="fc-section-kicker" data-i18n="yourNextRound">YOUR NEXT ROUND STARTS HERE</span><h2 data-i18n="ctaTitle">Bring your squad to FragCity.</h2><p data-i18n="ctaDesc">Browse the available sections and build your CS2 experience around your community.</p></div>
        <a class="fc-btn fc-btn-primary" href="?page=servers_vps" data-ajax-nav data-slug="servers_vps"><span data-i18n="getStarted">Get started</span><i class="fa-solid fa-arrow-left"></i></a>
    </section>
    <p class="fc-data-note"><i class="fa-solid fa-circle-info"></i><span data-i18n="dataNote">Server counts and live player statistics will appear here when a verified live data source is connected.</span></p>
</section>
