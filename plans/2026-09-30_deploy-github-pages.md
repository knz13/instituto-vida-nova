# Deploy no GitHub Pages

## Objetivo
Publicar o `dist/` em produção (https://knz13.github.io/instituto-vida-nova/) automaticamente a cada push na `main`, ou seja, a cada release mergeada.

## Decisões
- Workflow `.github/workflows/deploy.yml`: gatilho `push` na `main` e `workflow_dispatch`; `npm ci`, `npm run build`, `actions/upload-pages-artifact` (path `dist`) e `actions/deploy-pages`. Permissões mínimas (`contents: read`, `pages: write`, `id-token: write`) e `concurrency` para não sobrepor deploys.
- Precisa de `package-lock.json` commitado para o `npm ci`.
- Pages com origem "GitHub Actions" (configuração do repositório, ação pública feita só depois de aviso ao usuário).
- Só a `main` publica: o fluxo GitFlow garante que só release entra lá.

## Riscos
- Caminhos relativos no `dist` funcionam na subpasta `/instituto-vida-nova/`; conferir no site publicado.
- O token do `gh` pode não ter o escopo `workflow` para dar push do arquivo; nesse caso pedir ao usuário.
- O primeiro deploy só acontece quando a release chegar na `main`.

## Verificação
Após o merge na `main`: run do workflow verde, site abre, 4 rotas, imagens, axe nas páginas publicadas.
