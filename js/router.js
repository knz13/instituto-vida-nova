/* Roteador da SPA baseado em hash (#/rota), sem recarregar a página */
window.App = window.App || {};

App.router = (() => {
  function wireCadastro(view) {
    const form = view.querySelector('#form-cadastro');
    if (!form) return;

    App.modules.mascaras.aplicar(form);
    App.modules.validacao.configurar(form, (dados) => {
      App.modules.storage.salvar(dados);
      App.modules.eventos.abrirModal(
        'Cadastro enviado!',
        'Obrigado por apoiar o Instituto Vida Nova. Em breve nossa equipe entrará em contato.'
      );
    });
  }

  function wireInscritos(view) {
    view.querySelectorAll('.btn-remover-inscrito').forEach((botao) => {
      botao.addEventListener('click', () => {
        const id = Number(botao.dataset.id);
        App.modules.storage.remover(id);
        render(false);
        anunciar('Cadastro removido');
      });
    });
  }

  const rotas = {
    '': { template: () => App.templates.home(), titulo: 'Início' },
    projetos: { template: () => App.templates.projetos(), titulo: 'Projetos Sociais' },
    cadastro: { template: () => App.templates.cadastro(), titulo: 'Cadastre-se', after: wireCadastro },
    inscritos: { template: () => App.templates.inscritos(), titulo: 'Inscritos', after: wireInscritos },
  };

  function lerHash() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const [caminho, ancora] = hash.split('/');
    return { caminho: caminho || '', ancora };
  }

  function atualizarLinkAtivo(caminho) {
    document.querySelectorAll('[data-route]').forEach((link) => {
      const ativo = link.dataset.route === caminho;
      link.classList.toggle('active', ativo);
      if (ativo) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function anunciar(mensagem) {
    const regiao = document.getElementById('anuncio');
    if (regiao) regiao.textContent = mensagem;
  }

  function render(moverFoco = true) {
    const { caminho, ancora } = lerHash();
    const rota = rotas[caminho] || rotas[''];
    const view = document.getElementById('app-view');

    view.innerHTML = rota.template();
    document.title = `Instituto Vida Nova - ${rota.titulo}`;
    atualizarLinkAtivo(caminho);

    if (rota.after) rota.after(view);

    if (ancora) {
      const alvo = document.getElementById(ancora);
      if (alvo) alvo.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0 });
    }

    if (moverFoco) {
      const titulo = view.querySelector('h1');
      if (titulo) {
        titulo.setAttribute('tabindex', '-1');
        titulo.focus({ preventScroll: true });
      }
      anunciar(`Página ${rota.titulo}`);
    }
  }

  function init() {
    render(false);
    window.addEventListener('hashchange', () => render(true));
  }

  return { init, render };
})();
