# Build e otimização para produção

## Objetivo
Gerar uma pasta `dist/` pronta para deploy (GitHub Pages) com CSS/JS minificados e imagens comprimidas, sem mudar o código-fonte nem o comportamento do site. O código em `html/ css/ js/ imagens/` continua sendo a fonte e continua abrindo direto por `file://`.

## Decisões
- `package.json` só com devDependencies: `esbuild` (minificação) e `sharp` (imagens). Script `npm run build`.
- `scripts/build.mjs`:
  1. limpa `dist/`;
  2. lê a ordem dos `<link href="../css/...">` direto do `html/index.html` (não fica lista fixa no script, assim páginas novas entram sozinhas) e concatena e minifica em `dist/css/style.min.css`;
  3. idem para os `<script src="../js/...">` locais (storage, mascaras, validacao, 4 templates, router, eventos, main) e minifica em `dist/js/app.min.js`. Não tem `const/let` no topo dos arquivos, tudo pendura em `window.App`, então a concatenação é segura;
  4. converte `imagens/*` para WebP em `dist/imagens/` (hero/projetos q75; logo lossless, por ter texto e transparência), com `withoutEnlargement` (as imagens já estão em 1200px/320px, o ganho vem da conversão);
  5. gera `dist/index.html` a partir de `html/index.html`: troca os 5 `<link>` por 1, os 10 `<script>` locais por 1 (`defer`, mantendo o imask da CDN antes), e reescreve `../imagens/x.png|jpg` para `imagens/x.webp`. O mesmo reescreve dentro do JS (templates home/projetos).
  6. exige contagens exatas de reescrita (1 no HTML, 1 em home.js, 1 em projetos.js) e, no fim, falha se sobrar `../`, `.jpg` ou `.png` em `dist/index.html` ou `dist/js/app.min.js`; imprime a tabela de tamanhos antes/depois.
- `dist/` já está no `.gitignore`; o deploy publica `dist/` (GitHub Actions ou branch), decidido na etapa de deploy.
- `.gitignore` também ignora `node_modules/` (já ignora).

## Riscos / pontos de atenção
- Ordem dos scripts: imask (CDN) precisa carregar antes do bundle; com `defer` o bundle roda depois do parse, e `DOMContentLoaded` em `main.js` ainda dispara depois dos scripts defer. Conferir.
- Caminhos relativos: `dist/index.html` fica na raiz de `dist`, então `imagens/` e `css/` sem `../`. Funciona em subpasta do Pages (`/instituto-vida-nova/`) porque são relativos.
- WebP: suporte em todos os navegadores atuais; sem fallback.
- Acessibilidade não pode regredir: rodar axe nas 4 rotas no `dist` e repetir o teste de skip link/Escape.
- Sem source maps no dist de produção (opcional `--sourcemap` descartado para manter simples).

## Documentação
Atualizar o README: seção de build (`npm install && npm run build`) e a seção Manutenção (scripts novos continuam sendo registrados no `html/index.html`, o build lê de lá).

## Verificação
- `npm run build` sem erro, tabela de tamanhos.
- Servir `dist/` em uma porta, navegar nas 4 rotas, cadastrar e remover um inscrito, sem erros de console.
- Imagens: `naturalWidth > 0` em #/ e #/projetos e nenhum 404 na rede; logo no header.
- Máscaras IMask de CPF/telefone/CEP funcionando no cadastro (submit válido passa no `pattern`).
- Âncoras `#/projetos/doacao` e `#/projetos/voluntariado`; menu hambúrguer e dropdown em viewport mobile.
- Abrir `dist/index.html` via file://.
- axe-core: 0 violações; W3C Nu no `dist/index.html`.
- Comparar tamanhos (bytes) e, se possível, Lighthouse.

## Fora de escopo
Deploy (plano próprio), troca de fonte, lazy-loading, service worker.
