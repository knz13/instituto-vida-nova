/* Módulo de máscaras de entrada, usando a biblioteca externa IMask.js */
window.App = window.App || {};
window.App.modules = window.App.modules || {};

App.modules.mascaras = (() => {
  function aplicar(form) {
    if (!window.IMask) {
      console.warn('IMask não carregado; os campos ficarão sem máscara automática.');
      return;
    }

    const cpf = form.querySelector('#cpf');
    const telefone = form.querySelector('#telefone');
    const cep = form.querySelector('#cep');

    if (cpf) IMask(cpf, { mask: '000.000.000-00' });
    if (telefone) IMask(telefone, { mask: '(00) 00000-0000' });
    if (cep) IMask(cep, { mask: '00000-000' });
  }

  return { aplicar };
})();
