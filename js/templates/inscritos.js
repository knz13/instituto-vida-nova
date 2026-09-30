/* Template dinâmico da lista de inscritos (dados lidos do localStorage) */
window.App = window.App || {};
window.App.templates = window.App.templates || {};

App.templates.inscritos = (() => {
  const ROTULOS_INTERESSE = {
    doacao: 'Doação financeira',
    itens: 'Doação de itens',
    voluntariado: 'Voluntariado',
  };

  function cartaoInscrito(pessoa) {
    const interesses = (pessoa.interesses || [])
      .map((chave) => `<span class="badge badge-secondary">${ROTULOS_INTERESSE[chave] || chave}</span>`)
      .join(' ');

    return `
      <article class="card" data-id="${pessoa.id}">
        <h3>${pessoa.nome}</h3>
        <p>${pessoa.email} · ${pessoa.cidade}/${pessoa.estado}</p>
        <p>${interesses || '<span class="text-sm">Sem preferência informada</span>'}</p>
        <button type="button" class="btn btn-secondary btn-remover-inscrito" data-id="${pessoa.id}">Remover</button>
      </article>
    `;
  }

  return () => {
    const lista = App.modules.storage.listar();

    if (lista.length === 0) {
      return `
        <section id="inscritos" class="container">
          <h1>Apoiadores cadastrados</h1>
          <p>Nenhum cadastro salvo ainda neste navegador. Preencha o <a href="#/cadastro" data-link>formulário de cadastro</a> para ver os dados aparecerem aqui.</p>
        </section>
      `;
    }

    return `
      <section id="inscritos" class="container">
        <h1>Apoiadores cadastrados</h1>
        <p>Estes dados ficam salvos no localStorage do seu navegador, então continuam aqui mesmo depois de fechar e reabrir a página.</p>
        <div class="card-grid">
          ${lista.map(cartaoInscrito).join('')}
        </div>
      </section>
    `;
  };
})();
