/* Módulo de validação e envio de formulários com feedback visual */
window.App = window.App || {};
window.App.modules = window.App.modules || {};

App.modules.validacao = (() => {
  function configurar(form, aoEnviarComSucesso) {
    const alerta = document.getElementById('alerta-formulario');

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();

      if (!form.checkValidity()) {
        if (alerta) alerta.hidden = false;
        form.reportValidity();
        return;
      }

      if (alerta) alerta.hidden = true;

      const dados = Object.fromEntries(new FormData(form).entries());
      const interesses = new FormData(form).getAll('interesse');
      dados.interesses = interesses;

      aoEnviarComSucesso(dados);
      form.reset();
    });
  }

  return { configurar };
})();
