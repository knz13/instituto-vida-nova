/* Template dinâmico da página de projetos sociais */
window.App = window.App || {};
window.App.templates = window.App.templates || {};

App.templates.projetos = () => `
  <section id="projetos" class="container">
    <h1>Participe dos nossos projetos</h1>
    <img src="../imagens/projetos.jpg" alt="Ilustração representando doação e trabalho voluntário no Instituto Vida Nova">

    <section id="doacao">
      <h2>Como doar</h2>
      <p>Sua doação ajuda diretamente famílias em situação de vulnerabilidade. Você pode contribuir de duas formas:</p>

      <div class="card-grid">
        <article class="card">
          <span class="badge badge-primary">Financeira</span>
          <h3>Doação financeira</h3>
          <p>Via Pix para a chave <strong>doacoes@institutovidanova.org.br</strong> ou boleto mensal, gerado direto no nosso site.</p>
        </article>

        <article class="card">
          <span class="badge badge-secondary">Itens</span>
          <h3>Doação de itens</h3>
          <p>Recebemos alimentos não perecíveis, roupas e materiais escolares em nossa sede, de segunda a sexta, das 9h às 17h.</p>
        </article>
      </div>
    </section>

    <section id="voluntariado">
      <h2>Como ser voluntário</h2>
      <p>Buscamos voluntários para reforço escolar, distribuição de alimentos e apoio administrativo. O processo é simples:</p>

      <ol>
        <li>Preencha o formulário de cadastro na página de inscrição;</li>
        <li>Participe de uma conversa rápida com a equipe;</li>
        <li>Escolha os dias e horários disponíveis para colaborar.</li>
      </ol>

      <a href="#/cadastro" class="btn btn-primary" data-link>Quero ser voluntário</a>
    </section>
  </section>
`;
