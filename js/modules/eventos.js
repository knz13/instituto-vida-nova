/* Módulo de eventos globais: menu mobile, dropdown e modal (elementos fixos do layout, fora do #app-view) */
window.App = window.App || {};
window.App.modules = window.App.modules || {};

App.modules.eventos = (() => {
  function configurarMenuMobile() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const aberto = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(aberto));
    });

    menu.querySelectorAll('a[data-link]').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function configurarDropdown() {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
      const item = toggle.closest('.nav-item');

      toggle.addEventListener('click', () => {
        const aberto = item.classList.toggle('dropdown-open');
        toggle.setAttribute('aria-expanded', String(aberto));
      });

      item.querySelectorAll('.dropdown-menu a').forEach((link) => {
        link.addEventListener('click', () => {
          item.classList.remove('dropdown-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    });

    document.addEventListener('click', (evento) => {
      document.querySelectorAll('.nav-item.dropdown-open').forEach((item) => {
        if (!item.contains(evento.target)) {
          item.classList.remove('dropdown-open');
          item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function abrirModal(titulo, texto) {
    const modal = document.getElementById('modal-sucesso');
    if (!modal) return;
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-texto').textContent = texto;
    modal.hidden = false;
  }

  function configurarModal() {
    const modal = document.getElementById('modal-sucesso');
    const fechar = document.getElementById('modal-fechar');
    if (!modal || !fechar) return;

    fechar.addEventListener('click', () => {
      modal.hidden = true;
    });

    modal.addEventListener('click', (evento) => {
      if (evento.target === modal) modal.hidden = true;
    });
  }

  function configurar() {
    configurarMenuMobile();
    configurarDropdown();
    configurarModal();
  }

  return { configurar, abrirModal };
})();
