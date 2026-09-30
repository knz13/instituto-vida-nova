# Modo escuro e alto contraste

## Objetivo
Responder às preferências do sistema do usuário sem botão nem JS: `prefers-color-scheme: dark` e `prefers-contrast: more` (e a combinação dos dois), mantendo WCAG 2.1 AA (texto 4.5:1, componentes/bordas 3:1) em todos os modos.

## Decisão
Só CSS, por tokens. O problema: `--color-white` e `--color-neutral-900` são usados em dois papéis diferentes (fundo/superfície e texto sobre o verde), então trocar os tokens existentes quebraria o texto branco do header/botões. Por isso:
- criar tokens **semânticos** em `css/variables.css`: `--color-text`, `--color-text-muted`, `--color-surface`, `--color-surface-alt`, `--color-border`, `--color-border-strong`, `--color-link`, `--color-focus`, `--color-alert-error-bg/-text`, `--color-alert-success-bg/-text`, `--color-disabled-bg`; valores do modo claro = cores de hoje (nenhuma mudança visual no claro);
- trocar só os usos de "superfície/texto/borda/link" nos CSS pelos tokens semânticos (base, style, components). Texto branco sobre primária, `.btn-secondary` e skip link continuam com os tokens antigos;
- `@media (prefers-color-scheme: dark)`, `@media (prefers-contrast: more)` e `@media (prefers-color-scheme: dark) and (prefers-contrast: more)` só redefinem os tokens semânticos (e, no alto contraste, `--color-primary`/`-dark` mais escuros);
- `:root { color-scheme: light dark }` e `<meta name="color-scheme">` para scrollbar/select nativos; inputs ganham `background`/`color` explícitos pelos tokens;
- logo mantém o fundo branco próprio (`.logo-link img`), imagens não mudam.

## Contrastes calculados (antes de codar)
Dark: texto/fundo 15.53, muted 9.58, link 9.64, foco 11.63, borda forte 5.83 (≥3), alerta erro 7.82, sucesso 8.3.
Alto contraste: texto 21, muted 12.63, link 12.22, borda forte 21, erro 9.32, sucesso 9.58, branco/primária 11.87.
Dark + alto contraste: texto 21, muted 15.91, link 15.99, borda 11.42, erro 12.27.
Bordas decorativas (card/fieldset) ficam em 1.87 no dark, como hoje no claro (não são necessárias para identificar o componente); bordas de campos usam `--color-border-strong`.

## Riscos
- Sobrar `#e8f5e9`/`#fdecea` e `rgba` fixos nos alertas: substituir por tokens.
- `color-scheme: dark` muda o estilo nativo de inputs/select: conferir visualmente.
- `prefers-contrast: more` não é emulável pela ferramenta de teste; verificar por cálculo dos tokens e forçando os valores via JS/CSS de teste. Dizer isso na entrega.
- Sem toggle manual: segue o sistema (limitação assumida).

## Verificação
- Claro inalterado: comparar cores computadas das 4 rotas antes/depois.
- Dark (emulação `colorScheme: dark`): axe (color-contrast) 0 violações nas 4 rotas, conferir visual em screenshots (home, cadastro com erro, modal).
- Alto contraste: aplicar os tokens via `<style>` de teste e rodar axe; cálculo de razão por par.
- `npm run build` ok e dist idêntico em comportamento.
- Atualizar README (acessibilidade) e release v1.2.0 (minor: feature nova).

## Revisão (ajustes depois da crítica)
Tabela de valores (token → claro / dark / more / dark+more):

| token | claro | dark | more | dark+more |
| --- | --- | --- | --- | --- |
| surface | #ffffff | #121816 | #ffffff | #000000 |
| surface-alt | #f5f5f0 | #1c2421 | #f0f0f0 | #0d0d0d |
| text | #1a1a1a | #ecefed | #000000 | #ffffff |
| text-muted | #5f6368 | #b7bfbb | #333333 | #e0e0e0 |
| border | #d0d5d3 | #3d4744 | #595959 | #bfbfbf |
| border-strong | #737876 | #8b9591 | #000000 | #ffffff |
| link (também legend e `.modal h2`) | #1f6f54 | #6fd0a8 | #0b3d2c | #a6f0cf |
| focus | #16503c | #8fe0bf | #0b3d2c | #a6f0cf |
| field-invalid / field-valid | #c0392b / #2e7d32 | #ff8a7a / #7fd488 | #8a1c10 / #14501a | #ffb3a8 / #b2f0b6 |
| alert-error bg / texto | #fdecea / #c0392b | #3a1a16 / #ff9d90 | #ffffff / #8a1c10 | #000000 / #ffb3a8 |
| alert-success bg / texto | #e8f5e9 / #2e7d32 | #16301a / #8fd694 | #ffffff / #14501a | #000000 / #b2f0b6 |
| primary / primary-dark (só more e dark+more) | — | — | #0e3f2e / #082a1e | #0e3f2e / #082a1e |

Correções:
- `legend` (components.css:301) e `.modal h2` (components.css:409) usam `--color-link`, não `--color-primary` (a primária em texto dá ~3:1 no escuro).
- foco: `base.css:92` e `base.css:101` passam a usar `--color-focus`; `.site-header :focus-visible` continua amarelo sobre o verde.
- bordas `:user-invalid`/`:user-valid` (components.css:334/339) usam `--color-field-invalid/-valid`.
- ordem dos blocos: dark, more, e por último dark+more redefinindo a união completa dos tokens (nada vaza do `more` claro para o combinado).
- `.btn:disabled` não é usado hoje e é isento pela WCAG: só troca para tokens, sem meta de contraste.
