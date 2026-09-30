/* Módulo de persistência: guarda e lê os cadastros de apoiadores no localStorage */
window.App = window.App || {};
window.App.modules = window.App.modules || {};

App.modules.storage = (() => {
  const CHAVE = 'vidaNovaCadastros';

  function listar() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) || [];
    } catch (erro) {
      console.error('Não foi possível ler os cadastros salvos:', erro);
      return [];
    }
  }

  function salvar(cadastro) {
    const lista = listar();
    lista.push({ id: Date.now(), ...cadastro });
    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return lista;
  }

  function remover(id) {
    const lista = listar().filter((item) => item.id !== id);
    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return lista;
  }

  return { listar, salvar, remover };
})();
