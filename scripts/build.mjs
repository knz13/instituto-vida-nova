/* Gera a pasta dist/ (CSS e JS minificados, imagens em WebP) sem alterar o código-fonte */
import { readFile, writeFile, rm, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';
import sharp from 'sharp';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');
const htmlDir = path.join(raiz, 'html');

const tamanhos = [];

async function tamanho(arquivo) {
  return (await stat(arquivo)).size;
}

function falhar(mensagem) {
  console.error(`Erro no build: ${mensagem}`);
  process.exit(1);
}

function substituirExato(texto, de, para, esperado, onde) {
  const partes = texto.split(de);
  const encontrados = partes.length - 1;
  if (encontrados !== esperado) {
    falhar(`${onde}: esperava ${esperado} ocorrência(s) de "${de}", achei ${encontrados}`);
  }
  return partes.join(para);
}

async function concatenar(caminhos) {
  const conteudos = await Promise.all(caminhos.map((c) => readFile(path.resolve(htmlDir, c), 'utf8')));
  return { conteudos, tamanhoOriginal: conteudos.reduce((soma, c) => soma + Buffer.byteLength(c), 0) };
}

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'css'), { recursive: true });
await mkdir(path.join(dist, 'js'), { recursive: true });
await mkdir(path.join(dist, 'imagens'), { recursive: true });

let html = await readFile(path.join(htmlDir, 'index.html'), 'utf8');

// ordem dos arquivos vem do próprio index.html
const linksCss = [...html.matchAll(/<link rel="stylesheet" href="(\.\.\/css\/[^"]+)">\s*\n?/g)];
const scriptsJs = [...html.matchAll(/<script src="(\.\.\/js\/[^"]+)"><\/script>\s*\n?/g)];
if (linksCss.length === 0 || scriptsJs.length === 0) falhar('não achei os <link> de CSS ou <script> de JS no html/index.html');

// CSS
const css = await concatenar(linksCss.map((m) => m[1]));
const cssMin = await transform(css.conteudos.join('\n'), { loader: 'css', minify: true });
await writeFile(path.join(dist, 'css/style.min.css'), cssMin.code);
tamanhos.push([`CSS (${linksCss.length} arquivos → 1)`, css.tamanhoOriginal, await tamanho(path.join(dist, 'css/style.min.css'))]);

// JS (os arquivos só penduram coisas em window.App, então concatenar na ordem do HTML é seguro)
const js = await concatenar(scriptsJs.map((m) => m[1]));
let codigo = js.conteudos.join('\n;\n');
codigo = substituirExato(codigo, '../imagens/hero.jpg', 'imagens/hero.webp', 1, 'js/templates/home.js');
codigo = substituirExato(codigo, '../imagens/projetos.jpg', 'imagens/projetos.webp', 1, 'js/templates/projetos.js');
const jsMin = await transform(codigo, { loader: 'js', minify: true, target: 'es2020' });
await writeFile(path.join(dist, 'js/app.min.js'), jsMin.code);
tamanhos.push([`JS (${scriptsJs.length} arquivos → 1)`, js.tamanhoOriginal, await tamanho(path.join(dist, 'js/app.min.js'))]);

// Imagens
const imagens = [
  { origem: 'hero.jpg', destino: 'hero.webp', opcoes: { quality: 75 } },
  { origem: 'projetos.jpg', destino: 'projetos.webp', opcoes: { quality: 75 } },
  { origem: 'logo.png', destino: 'logo.webp', opcoes: { lossless: true } },
];
for (const { origem, destino, opcoes } of imagens) {
  const entrada = path.join(raiz, 'imagens', origem);
  const saida = path.join(dist, 'imagens', destino);
  await sharp(entrada).webp(opcoes).toFile(saida);
  tamanhos.push([`imagens/${origem}`, await tamanho(entrada), await tamanho(saida)]);
}

// HTML: troca os vários <link>/<script> por um só e ajusta o caminho do logo
let saida = html;
linksCss.forEach((m, i) => {
  saida = saida.replace(m[0], i === 0 ? '<link rel="stylesheet" href="css/style.min.css">\n' : '');
});
scriptsJs.forEach((m, i) => {
  saida = saida.replace(m[0], i === 0 ? '<script src="js/app.min.js" defer></script>\n' : '');
});
saida = substituirExato(saida, '../imagens/logo.png', 'imagens/logo.webp', 1, 'html/index.html');
await writeFile(path.join(dist, 'index.html'), saida);

// Conferência final: não pode sobrar caminho antigo nem imagem não convertida
for (const arquivo of ['index.html', 'js/app.min.js']) {
  const conteudo = await readFile(path.join(dist, arquivo), 'utf8');
  const sobras = conteudo.match(/\.\.\/(css|js|imagens)\/|imagens\/[\w-]+\.(jpg|png)/g);
  if (sobras) falhar(`sobrou referência antiga em dist/${arquivo}: ${[...new Set(sobras)].join(', ')}`);
}

console.log('\nBuild concluído em dist/\n');
console.log('arquivo'.padEnd(26), 'antes'.padStart(9), 'depois'.padStart(9), 'economia'.padStart(9));
let antes = 0;
let depois = 0;
for (const [nome, a, d] of tamanhos) {
  antes += a;
  depois += d;
  console.log(nome.padEnd(26), `${a}`.padStart(9), `${d}`.padStart(9), `${Math.round((1 - d / a) * 100)}%`.padStart(9));
}
console.log('total'.padEnd(26), `${antes}`.padStart(9), `${depois}`.padStart(9), `${Math.round((1 - depois / antes) * 100)}%`.padStart(9));
