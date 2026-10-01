// Shared disclosure navigation for the Home, Dogs, account, Adopt, and Contact pages.
(() => {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const toggle = header.querySelector('[data-menu-toggle]');
  const desktop = window.matchMedia('(min-width: 60rem)');
  const setOpen = open => {
    document.body.classList.toggle('site-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  header.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  desktop.addEventListener('change', () => {
    const active = document.activeElement;
    const hideLink = !desktop.matches && active.matches('#site-navigation a, #site-account-links a');
    const hideToggle = desktop.matches && active === toggle;
    setOpen(false);
    if (hideLink) toggle.focus();
    if (hideToggle) header.querySelector('a').focus();
  });
  document.body.classList.add('site-menu-ready');
  document.querySelectorAll('[id$="-year"]').forEach(year => {
    year.textContent = new Date().getFullYear();
  });
})();
