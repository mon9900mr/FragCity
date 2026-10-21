(() => {
  const nav = document.querySelector('nav');
  const menu = document.querySelector('.menu-toggle');
  if (menu && nav) menu.addEventListener('click', () => nav.classList.toggle('open'));

  function toast(message) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.textContent = message;
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 4200);
  }

  document.querySelectorAll('.choose-plan').forEach(button => {
    button.addEventListener('click', () => toast('Preview only: "' + button.dataset.plan + '" selected. Checkout is not connected.'));
  });

  document.querySelectorAll('.demo-action').forEach(button => {
    button.addEventListener('click', () => toast('Demo only: "' + button.dataset.action + '" was not sent to a live server.'));
  });

  const filters = document.querySelectorAll('[data-filter]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const type = button.dataset.filter;
    document.querySelectorAll('.skin-card').forEach(card => {
      card.hidden = type !== 'all' && card.dataset.type !== type;
    });
  }));

  document.querySelectorAll('.select-skin').forEach(button => {
    button.addEventListener('click', () => toast('Preview selection: ' + button.dataset.skin + '. No in-game change was made.'));
  });

  const form = document.querySelector('#support-form');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    toast('Form preview complete. No ticket was sent or stored.');
    form.reset();
  });
})();