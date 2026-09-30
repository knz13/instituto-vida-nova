/* Módulo de validação e envio de formulários com feedback visual */
window.App = window.App || {};
window.App.modules = window.App.modules || {};

App.modules.validacao = (() => {
  function rotuloDoCampo(campo) {
    const rotulo = rotuloAssociado(campo);
    return rotulo ? rotulo.textContent.trim() : campo.name;
  }

  function rotuloAssociado(campo) {
    return campo.id ? document.querySelector(`label[for="${campo.id}"]`) : null;
  }

  function limparErros(form) {
    form.querySelectorAll('[aria-invalid]').forEach((campo) => campo.removeAttribute('aria-invalid'));
  }

  function mostrarAlerta(alerta, invalidos) {
    if (!alerta) return;
    const itens = invalidos.map((campo) => `<li>${rotuloDoCampo(campo)}</li>`).join('');
    alerta.innerHTML = `Preencha corretamente os campos abaixo antes de enviar:<ul>${itens}</ul>`;
    alerta.hidden = false;
  }

  function atualizarErros(form, alerta) {
    const invalidos = Array.from(form.elements).filter((campo) => campo.hasAttribute('aria-invalid'));
    invalidos.forEach((campo) => {
      if (campo.checkValidity()) campo.removeAttribute('aria-invalid');
    });
    const restantes = invalidos.filter((campo) => campo.hasAttribute('aria-invalid'));
    if (restantes.length === invalidos.length) return; // nada mudou: não reanuncia o alerta
    if (restantes.length === 0) {
      alerta.hidden = true;
      alerta.textContent = '';
    } else {
      mostrarAlerta(alerta, restantes);
    }
  }

  function configurar(form, aoEnviarComSucesso) {
    const alerta = document.getElementById('alerta-formulario');

    ['input', 'change'].forEach((tipo) => {
      form.addEventListener(tipo, () => {
        if (alerta && !alerta.hidden) atualizarErros(form, alerta);
      });
    });

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();

      limparErros(form);

      if (!form.checkValidity()) {
        const invalidos = Array.from(form.elements).filter((campo) => campo.willValidate && !campo.checkValidity());
        invalidos.forEach((campo) => campo.setAttribute('aria-invalid', 'true'));
        mostrarAlerta(alerta, invalidos);
        invalidos[0].focus();
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
