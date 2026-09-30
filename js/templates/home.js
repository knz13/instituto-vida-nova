/* Template dinâmico da página inicial */
window.App = window.App || {};
window.App.templates = window.App.templates || {};

App.templates.home = () => `
  <section id="apresentacao" class="container">
    <h1>Instituto Vida Nova</h1>
    <img src="../imagens/hero.jpg" alt="Voluntários do Instituto Vida Nova distribuindo alimentos para famílias da comunidade">
    <h2>Quem somos</h2>
    <p>O Instituto Vida Nova é uma organização sem fins lucrativos que atua há mais de 10 anos apoiando famílias em situação de vulnerabilidade social na região do Distrito Federal.</p>
  </section>

  <section id="missao" class="container">
    <h2>Nossa missão</h2>
    <p>Promover educação, alimentação e moradia digna para crianças, jovens e famílias em situação de risco, por meio de projetos sociais e parcerias com a comunidade.</p>
  </section>

  <section id="contato" class="container">
    <h2>Fale conosco</h2>
    <address>
      <p>E-mail: contato@institutovidanova.org.br</p>
      <p>Telefone: (61) 3333-4444</p>
      <p>Endereço: SQN 123, Bloco A - Brasília/DF</p>
    </address>
  </section>
`;
