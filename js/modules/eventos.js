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

      const liberar = () => item.classList.remove('dropdown-fechado');
      item.addEventListener('mouseleave', liberar);
      item.addEventListener('focusout', (evento) => {
        if (!item.contains(evento.relatedTarget)) liberar();
      });

      toggle.addEventListener('click', () => {
        liberar();
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

  let elementoAntesDoModal = null;

  function abrirModal(titulo, texto) {
    const modal = document.getElementById('modal-sucesso');
    if (!modal) return;
    elementoAntesDoModal = document.activeElement;
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-texto').textContent = texto;
    modal.hidden = false;
    document.getElementById('modal-fechar').focus();
  }

  function fecharModal() {
    const modal = document.getElementById('modal-sucesso');
    if (!modal) return;
    modal.hidden = true;
    if (elementoAntesDoModal && document.contains(elementoAntesDoModal)) {
      elementoAntesDoModal.focus();
    }
    elementoAntesDoModal = null;
  }

  function configurarModal() {
    const modal = document.getElementById('modal-sucesso');
    const fechar = document.getElementById('modal-fechar');
    if (!modal || !fechar) return;

    fechar.addEventListener('click', fecharModal);

    modal.addEventListener('click', (evento) => {
      if (evento.target === modal) fecharModal();
    });

    modal.addEventListener('keydown', (evento) => {
      if (evento.key !== 'Tab') return;
      // único elemento focável do modal é o botão Fechar: mantém o foco nele
      evento.preventDefault();
      fechar.focus();
    });
  }

  function configurarEscape() {
    document.addEventListener('keydown', (evento) => {
      if (evento.key !== 'Escape') return;

      const modal = document.getElementById('modal-sucesso');
      if (modal && !modal.hidden) {
        fecharModal();
        return;
      }

      const dropdown = document.querySelector('.nav-item.dropdown-open')
        || document.querySelector('.nav-item:focus-within:has(.dropdown-toggle)');
      if (dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        dropdown.classList.remove('dropdown-open');
        // no desktop o menu também abre por hover/foco; esta classe força o fechamento
        dropdown.classList.add('dropdown-fechado');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
        return;
      }

      const menu = document.querySelector('.nav-menu.is-open');
      if (menu) {
        menu.classList.remove('is-open');
        const botao = document.querySelector('.nav-toggle');
        botao.setAttribute('aria-expanded', 'false');
        botao.focus();
      }
    });
  }

  function configurarSkipLink() {
    const link = document.querySelector('.skip-link');
    if (!link) return;
    // o href="#app-view" mudaria o hash e o roteador renderizaria a home; só move o foco
    link.addEventListener('click', (evento) => {
      evento.preventDefault();
      document.getElementById('app-view').focus();
    });
  }

  function configurar() {
    configurarSkipLink();
    configurarEscape();
    configurarMenuMobile();
    configurarDropdown();
    configurarModal();
  }

  return { configurar, abrirModal };
})();
