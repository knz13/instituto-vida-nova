# Instituto Vida Nova

Site institucional de uma ONG fictícia, feito como projeto da disciplina de Desenvolvimento Front-End (UDF). É uma SPA (Single Page Application) em HTML, CSS e JavaScript puros, sem framework.

## Funcionalidades

- Navegação entre páginas sem recarregar (roteador por hash: `#/`, `#/projetos`, `#/cadastro`, `#/inscritos`)
- Páginas geradas por templates em JavaScript
- Formulário de cadastro com validação nativa do HTML5, máscaras de CPF, telefone e CEP (biblioteca IMask) e feedback visual
- Cadastros salvos no `localStorage` e listados na página de inscritos
- Layout responsivo com grid de 12 colunas e 5 breakpoints (480, 768, 1024, 1280 e 1440 px)
- Menu com dropdown no desktop e menu hambúrguer no celular

## Estrutura de pastas

```
html/        index.html (shell único da SPA)
css/         variables, base, layout, components e style
js/
  modules/   storage, mascaras, validacao, eventos
  templates/ home, projetos, cadastro, inscritos
  router.js  roteador por hash
  main.js    ponto de entrada
imagens/     logo e imagens do site
```

## Como executar

Não há dependências para instalar. Sirva a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000/html/index.html.

Também funciona abrindo `html/index.html` direto no navegador, porque o projeto não usa ES Modules.

## Build de produção

O código-fonte continua abrindo direto no navegador. Para gerar a versão otimizada (CSS e JS minificados em um arquivo cada, imagens em WebP):

```bash
npm install
npm run build
```

O resultado vai para `dist/` (ignorada pelo Git). O script `scripts/build.mjs` lê a ordem dos arquivos do próprio `html/index.html`.

## Acessibilidade

O site segue a WCAG 2.1 AA: link "Pular para o conteúdo", landmarks nomeados, foco movido para o título a cada troca de página, navegação completa por teclado (Escape fecha modal, dropdown e menu), foco visível, contraste mínimo nos campos e erros de formulário descritos em texto. A auditoria com o axe-core não encontra violações nas quatro rotas.

O site também respeita as preferências do sistema, só com CSS: modo escuro (`prefers-color-scheme: dark`), alto contraste (`prefers-contrast: more`) e os dois juntos. As cores são tokens semânticos em `css/variables.css` (`--color-surface`, `--color-text`, `--color-link`, `--color-border-strong`...), e cada modo só redefine esses tokens. Contraste de texto de 4,5:1 ou mais e de bordas de campos de 3:1 ou mais em todos os modos; não tem botão de alternar, ele segue o sistema.

## Como usar

1. Acesse **Cadastre-se** e preencha o formulário.
2. Em **Inscritos** confira os cadastros salvos. Eles continuam lá depois de recarregar a página.
3. Use **Remover** para apagar um cadastro.

## Fluxo de trabalho (GitFlow)

| Branch | Uso |
| --- | --- |
| `main` | Versões publicadas, marcadas com tags (`v1.0.0`, ...) |
| `develop` | Integração do desenvolvimento |
| `feature/*` | Cada funcionalidade, aberta a partir de `develop` |
| `hotfix/*` | Correções urgentes a partir de `main` |

Toda mudança entra por pull request com merge commit.

### Convenção de commits

Mensagens no formato `tipo(escopo): descrição`, com os tipos `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `build` e `chore`. Exemplo: `feat(css): adiciona grid de 12 colunas e 5 breakpoints`.

## Manutenção

- Nova página: criar `js/templates/<nome>.js`, registrar a rota em `js/router.js` e incluir o `<script>` em `html/index.html` (o build lê a lista de lá).
- Novo módulo: seguir o padrão `App.modules.<nome> = (() => { ... })()` e expor só o necessário.
- Validar o HTML no [W3C Validator](https://validator.w3.org/nu/) antes de abrir o pull request.

## Autor

Otavio Oliveira de Maya Viana
