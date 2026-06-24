// Gera PDFs simples e legíveis dos docs de backend, com as cores da marca BdayList.
// Uso: node docs/backend/pdf/gerar-pdfs.mjs
// Conversor Markdown→HTML autocontido (sem dependências) + Chrome headless --print-to-pdf.

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(here, "..");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const DOCS = [
  ["README.md", "00-visao-geral.pdf"],
  ["adr/0001-plataforma-de-backend.md", "adr-0001-plataforma-de-backend.pdf"],
  ["adr/0002-escolha-de-banco.md", "adr-0002-escolha-de-banco.pdf"],
  ["adr/0003-seguranca-e-lgpd.md", "adr-0003-seguranca-e-lgpd.pdf"],
  ["specs/01-modelo-de-dados.md", "spec-01-modelo-de-dados.pdf"],
  ["specs/02-motor-de-reserva.md", "spec-02-motor-de-reserva.pdf"],
  ["specs/03-autorizacao-privacidade.md", "spec-03-autorizacao-privacidade.pdf"],
  ["specs/04-integracoes.md", "spec-04-integracoes.pdf"],
  ["specs/05-contratos-endpoints.md", "spec-05-contratos-endpoints.pdf"],
];

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

function renderCells(line) {
  return line
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing fence
      html.push(
        `<pre class="lang-${escapeHtml(lang)}"><code>${escapeHtml(buf.join("\n"))}</code></pre>`
      );
      continue;
    }

    // Table (GFM)
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1]) &&
      lines[i + 1].includes("-")
    ) {
      const header = renderCells(line);
      i += 2; // header + separator
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(renderCells(lines[i]));
        i++;
      }
      const thead = `<thead><tr>${header.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
        .join("")}</tbody>`;
      html.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    // Heading
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line)) {
      html.push("<hr>");
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
      continue;
    }

    // Lists (ordered / unordered, incl. checkboxes)
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const tag = ordered ? "ol" : "ul";
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        const content = lines[i].replace(/^\s*([-*]|\d+\.)\s+/, "");
        items.push(`<li>${inline(content)}</li>`);
        i++;
      }
      html.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph (collect consecutive non-empty, non-block lines)
    const buf = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6}\s|```|>\s?|---+\s*$|\s*([-*]|\d+\.)\s+)/.test(lines[i]) &&
      !(lines[i].includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|/.test(lines[i + 1]))
    ) {
      buf.push(lines[i]);
      i++;
    }
    html.push(`<p>${inline(buf.join(" "))}</p>`);
  }

  return html.join("\n");
}

const CSS = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    color: #161d1f; line-height: 1.55; font-size: 11.5px; margin: 0;
  }
  .brand { display: flex; align-items: baseline; gap: 10px; border-bottom: 3px solid #FF5A70;
    padding-bottom: 10px; margin-bottom: 22px; }
  .brand .logo { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #b5213e; }
  .brand .tag { font-size: 11px; color: #26C6DA; font-weight: 700; }
  h1 { font-size: 21px; color: #b5213e; letter-spacing: -0.4px; margin: 0 0 12px; }
  h2 { font-size: 16px; color: #161d1f; margin: 22px 0 8px; border-bottom: 1px solid #ffd9e0; padding-bottom: 4px; }
  h3 { font-size: 13.5px; color: #006874; margin: 16px 0 6px; }
  h4 { font-size: 12px; color: #161d1f; margin: 12px 0 4px; }
  p { margin: 7px 0; }
  a { color: #b5213e; text-decoration: none; }
  code { font-family: "SF Mono", "Menlo", Consolas, monospace; font-size: 10px;
    background: #FFF1F4; color: #b5213e; padding: 1px 5px; border-radius: 5px; }
  pre { background: #1f2937; color: #f3f4f6; padding: 12px 14px; border-radius: 10px;
    overflow-x: auto; font-size: 9.5px; line-height: 1.5; page-break-inside: avoid; }
  pre code { background: none; color: inherit; padding: 0; font-size: 9.5px; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 10px; page-break-inside: avoid; }
  th { background: #FF5A70; color: #fff; text-align: left; padding: 6px 9px; font-weight: 700; }
  td { border: 1px solid #ffd9e0; padding: 6px 9px; vertical-align: top; }
  tr:nth-child(even) td { background: #FFF9FB; }
  blockquote { margin: 12px 0; padding: 8px 14px; background: #FFF9FB;
    border-left: 4px solid #FFD54F; border-radius: 4px; color: #444; }
  ul, ol { margin: 7px 0; padding-left: 22px; }
  li { margin: 3px 0; }
  hr { border: none; border-top: 1px solid #ffd9e0; margin: 16px 0; }
`;

function wrap(bodyHtml) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<style>${CSS}</style></head><body>
<div class="brand"><span class="logo">BdayList</span><span class="tag">Documentação de backend</span></div>
${bodyHtml}
</body></html>`;
}

const work = mkdtempSync(join(tmpdir(), "bday-pdf-"));
let ok = 0;
try {
  for (const [src, outName] of DOCS) {
    const md = readFileSync(join(backendRoot, src), "utf8");
    const htmlPath = join(work, basename(outName).replace(/\.pdf$/, ".html"));
    writeFileSync(htmlPath, wrap(mdToHtml(md)), "utf8");
    const outPath = join(here, outName);
    execFileSync(CHROME, [
      "--headless",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--print-to-pdf=${outPath}`,
      `file://${htmlPath}`,
    ], { stdio: "ignore" });
    console.log("PDF gerado:", outName);
    ok++;
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
console.log(`\n${ok}/${DOCS.length} PDFs em docs/backend/pdf/`);
