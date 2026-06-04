/* Loads the shared navigation and footer on every page. */
(async function loadSharedComponents() {
  const root = document.body.dataset.root || './';
  const page = document.body.dataset.page || '';

  async function inject(targetId, componentPath) {
    const target = document.getElementById(targetId);
    if (!target) return;

    try {
      const response = await fetch(`${root}${componentPath}`);
      if (!response.ok) throw new Error(`Unable to load ${componentPath}`);
      const html = (await response.text()).replaceAll('{{ROOT}}', root);
      target.innerHTML = html;
    } catch (error) {
      console.error(error);
    }
  }

  await Promise.all([
    inject('site-nav', 'components/nav.html'),
    inject('site-footer', 'components/footer.html')
  ]);

  const activeLink = document.querySelector(`[data-nav-link="${page}"]`);
  if (activeLink) activeLink.setAttribute('aria-current', 'page');

  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.primary-navigation');
  if (toggle && navigation) {
    toggle.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('[data-current-year]').forEach((item) => {
    item.textContent = new Date().getFullYear();
  });
})();
