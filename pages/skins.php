<?php
// pages/skins.php — full FRAG CITY CS2 skins catalog
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (
    empty($_SESSION['user_logged_in']) ||
    empty($_SESSION['steamid'])
) {
    $_SESSION['login_return_url'] =
        $_SERVER['REQUEST_URI'] ?? 'index.php?page=skins';

    header('Location: index.php?page=login', true, 303);
    exit;
}
?>

<div class="skins-page-shell">
    <iframe
        class="skins-iframe"
        src="/fragcity-ui/skins.html"
        title="FragCity CS2 Skins Catalog"
        allow="clipboard-write"
        loading="eager"
        style="display:block;width:100%;min-height:calc(100vh - 80px);border:0;background:#101012"
    ></iframe>
</div>
