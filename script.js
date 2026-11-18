/* =========================================================
   script.js  ·  Monta o site a partir do dados.js
   ========================================================= */
"use strict";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- imagem reserva (quando a foto ainda não existe) ---------- */
function PH(texto) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b2a5b"/><stop offset="1" stop-color="#1c4a9b"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><text x="400" y="315" fill="#fff" fill-opacity=".75" font-family="sans-serif" font-size="38" text-anchor="middle">${texto}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
const img = (src, alt = "", extra = "") =>
  `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" ${extra} onerror="this.onerror=null;this.src=PH('Adicionar foto')">`;

/* ---------- caminhos ---------- */
function resolve(base, arquivo) {
  if (!arquivo) return "";
  if (/^(https?:)?\/\//.test(arquivo) || arquivo.includes("/")) return arquivo;
  return (base || "") + arquivo;
}

/* ---------- datas ---------- */
const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const pad = (n) => String(n).padStart(2, "0");
const parseData = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };

/* ---------- galeria (fotos + vídeos) ---------- */
function ytId(url) {
  const m = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/.exec(url);
  return m ? m[1] : null;
}
function galeriaHTML(base, fotos = [], videos = []) {
  if (!fotos.length && !videos.length) return `<p class="vazio">Fotos e vídeos em breve.</p>`;
  let html = "";
  if (fotos.length) {
    html += `<div class="galeria">` +
      fotos.map((f) => `<div class="foto-item">${img(resolve(base, f), "Foto", "data-lb")}</div>`).join("") + `</div>`;
  }
  if (videos.length) {
    html += `<div class="videos">` + videos.map((v) => {
      const url = resolve(base, v);
      const id = ytId(url);
      return id
        ? `<div class="video-item"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="Vídeo" loading="lazy" allowfullscreen></iframe></div>`
        : `<div class="video-item"><video controls preload="none" src="${esc(url)}"></video></div>`;
    }).join("") + `</div>`;
  }
  return html;
}
function contagem(fotos = [], videos = []) {
  const f = fotos.length, v = videos.length;
  if (!f && !v) return "Sem mídia ainda";
  return [f ? `${f} foto${f > 1 ? "s" : ""}` : "", v ? `${v} vídeo${v > 1 ? "s" : ""}` : ""].filter(Boolean).join(" · ");
}

/* ---------- carrossel genérico ---------- */
function carrossel(root, { perView = () => 1, autoplay = 0 } = {}) {
  const track = $(".track", root);
  const slides = [...track.children];
  const dots = $(".dots", root);
  let i = 0, pv = perView(), timer = null, x0 = null;

  const max = () => Math.max(0, slides.length - pv);
  function render() {
    pv = perView();
    i = Math.min(i, max());
    slides.forEach((s) => (s.style.flex = `0 0 ${100 / pv}%`));
    track.style.transform = `translateX(${(-i * 100) / pv}%)`;
    dots.innerHTML = Array.from({ length: max() + 1 }, (_, k) => `<button class="${k === i ? "on" : ""}" aria-label="Ir para ${k + 1}"></button>`).join("");
    [...dots.children].forEach((b, k) => (b.onclick = () => ir(k)));
    const esconder = max() === 0;
    root.querySelectorAll(".car-btn").forEach((b) => (b.style.display = esconder ? "none" : ""));
    dots.style.display = esconder ? "none" : "";
  }
  function ir(n) { const m = max(); i = n > m ? 0 : n < 0 ? m : n; render(); reiniciar(); }
  function reiniciar() {
    clearInterval(timer);
    if (autoplay && max() > 0) timer = setInterval(() => ir(i + 1), autoplay);
  }
  $(".prev", root).onclick = () => ir(i - 1);
  $(".next", root).onclick = () => ir(i + 1);
  root.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  root.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) ir(dx < 0 ? i + 1 : i - 1);
  });
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", reiniciar);
  window.addEventListener("resize", render);
  render(); reiniciar();
}

/* ---------- header / menu ---------- */
function iniciarMenu() {
  const btn = $("#menuBtn"), nav = $("#nav");
  btn.onclick = () => {
    const aberto = nav.classList.toggle("aberto");
    btn.setAttribute("aria-expanded", aberto);
  };
  nav.querySelectorAll("a").forEach((a) => (a.onclick = () => { nav.classList.remove("aberto"); btn.setAttribute("aria-expanded", false); }));
}

/* ---------- história ---------- */
function montarHistoria() {
  $("#historiaTexto").textContent = HISTORIA.texto;
  $("#historiaTrack").innerHTML = HISTORIA.slides.map((s) => `
    <div class="slide"><div class="hist-slide">
      ${img(resolve("assets/historia/", s.foto), s.titulo)}
      <div class="hist-legenda"><h3>${esc(s.titulo)}</h3><p>${esc(s.texto)}</p></div>
    </div></div>`).join("");
  carrossel($("#carHistoria"), { autoplay: 6000 });
}

/* ---------- lideranças ---------- */
function montarLiderancas() {
  $("#liderancasLista").innerHTML = LIDERANCAS.map((g) => `
    <div class="grupo">
      <div class="grupo-cab"><h3>${esc(g.grupo)}</h3>${g.descricao ? `<p>${esc(g.descricao)}</p>` : ""}</div>
      <div class="grid-lideres">
        ${g.membros.map((m) => `
          <article class="lider">
            <div class="foto">${img(resolve("assets/liderancas/", m.foto), m.nome)}</div>
            <h4>${esc(m.nome)}</h4>
            <p class="cargo">${esc(m.cargo)}</p>
            ${m.descricao ? `<p class="desc">${esc(m.descricao)}</p>` : ""}
          </article>`).join("")}
      </div>
    </div>`).join("");
}

/* ---------- eventos ---------- */
function cartaoEvento({ titulo, data, descricao, pasta, fotos, videos }) {
  const d = parseData(data);
  const mes = MESES[d.getMonth()].slice(0, 3);
  return `
  <article class="evento">
    <div class="evento-cab">
      <div class="data-cx"><b>${mes}</b><span>${pad(d.getDate())}</span><small>${d.getFullYear()}</small></div>
      <div class="evento-info">
        <h3>${esc(titulo)}</h3>
        ${descricao ? `<p>${esc(descricao)}</p>` : ""}
        <p class="contagem">${contagem(fotos, videos)}</p>
      </div>
    </div>
    <details>
      <summary class="ver-midia">Ver fotos e vídeos</summary>
      <div class="evento-midia">${galeriaHTML(pasta, fotos, videos)}</div>
    </details>
  </article>`;
}
function montarEventos() {
  const lista = $("#eventosLista");
  const dados = {
    batismos: () => BATISMOS.map((b) => ({ ...b })),
    outros: () => EVENTOS.map((e) => ({ ...e, titulo: e.nome }))
  };
  function mostrar(aba) {
    const itens = dados[aba]().sort((a, b) => b.data.localeCompare(a.data));
    lista.innerHTML = itens.length ? itens.map(cartaoEvento).join("") : `<p class="vazio">Nenhum evento cadastrado ainda.</p>`;
  }
  document.querySelectorAll("#abasEventos .aba").forEach((b) => (b.onclick = () => {
    document.querySelectorAll("#abasEventos .aba").forEach((x) => x.classList.toggle("on", x === b));
    mostrar(b.dataset.aba);
  }));
  mostrar("batismos");
}

/* ---------- cultos (ano → mês → domingo) ---------- */
function domingosDoMes(ano, mes) {
  const lista = [];
  const total = new Date(ano, mes + 1, 0).getDate();
  for (let d = 1; d <= total; d++) if (new Date(ano, mes, d).getDay() === 0) lista.push(d);
  return lista;
}
function montarCultos() {
  const abas = $("#abasAnos"), lista = $("#cultosLista");
  const hoje = new Date();
  const anoInicial = CULTOS_ANOS.includes(hoje.getFullYear()) ? hoje.getFullYear() : CULTOS_ANOS[0];

  function mostrarAno(ano) {
    abas.querySelectorAll(".aba").forEach((b) => b.classList.toggle("on", Number(b.dataset.ano) === ano));
    let html = "";
    for (let m = 0; m < 12; m++) {
      const domingos = domingosDoMes(ano, m);
      const comMidia = domingos.filter((d) => {
        const c = CULTOS[`${ano}-${pad(m + 1)}-${pad(d)}`];
        return c && ((c.fotos || []).length || (c.videos || []).length);
      }).length;
      const abrir = ano === hoje.getFullYear() && m === hoje.getMonth() ? "open" : "";
      html += `
      <details class="mes" ${abrir}>
        <summary>${MESES[m]} <span class="mes-meta">${domingos.length} domingos · ${comMidia} com mídia</span></summary>
        <div class="mes-corpo">
          ${domingos.map((d) => {
            const chave = `${ano}-${pad(m + 1)}-${pad(d)}`;
            const c = CULTOS[chave] || {};
            const fotos = c.fotos || [], videos = c.videos || [];
            const base = `assets/cultos/${ano}/${pad(m + 1)}/${chave}/`;
            const total = fotos.length + videos.length;
            const nome = parseData(chave).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
            return `
            <details class="dom">
              <summary>
                <span class="dom-dia">${pad(d)}</span>
                <span class="dom-nome">${esc(c.titulo ? c.titulo + " · " : "")}${nome}</span>
                <span class="badge ${total ? "" : "zero"}">${contagem(fotos, videos)}</span>
              </summary>
              <div class="dom-corpo">${galeriaHTML(base, fotos, videos)}</div>
            </details>`;
          }).join("")}
        </div>
      </details>`;
    }
    lista.innerHTML = html;
  }

  abas.innerHTML = CULTOS_ANOS.map((a) => `<button class="aba" data-ano="${a}" role="tab">${a}</button>`).join("");
  abas.querySelectorAll(".aba").forEach((b) => (b.onclick = () => mostrarAno(Number(b.dataset.ano))));
  mostrarAno(anoInicial);
}

/* ---------- redes sociais ---------- */
const ICONES = {
  facebook: `<svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`
};
function montarRedes() {
  $("#redesLista").innerHTML = REDES.map((r) => `
    <a class="rede" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">
      <div class="ic">${ICONES[r.icone] || ""}</div>
      <b>${esc(r.nome)}</b><span>${esc(r.texto)}</span>
    </a>`).join("");
  $("#footerRedes").innerHTML = REDES.map((r) =>
    `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.nome)}</a>`).join("");
}

/* ---------- equipe de mídia ---------- */
function montarMidia() {
  $("#midiaTrack").innerHTML = MIDIA.map((p) => `
    <div class="slide"><article class="midia-card">
      <div class="foto">${img(resolve("assets/midia/", p.foto), p.nome)}</div>
      <div class="info"><h3>${esc(p.nome)}</h3><p>${esc(p.funcao)}</p></div>
    </article></div>`).join("");
  const w = () => (window.innerWidth >= 960 ? 3 : window.innerWidth >= 600 ? 2 : 1);
  carrossel($("#carMidia"), { perView: w, autoplay: 4500 });
}

/* ---------- lightbox ---------- */
function iniciarLightbox() {
  const box = $("#lightbox"), im = $("#lbImg"), cont = $("#lbCont");
  let lista = [], pos = 0;
  const mostrar = () => { im.src = lista[pos].src; cont.textContent = `${pos + 1} / ${lista.length}`; };
  const abrir = (imgs, i) => { lista = imgs; pos = i; mostrar(); box.hidden = false; document.body.style.overflow = "hidden"; };
  const fechar = () => { box.hidden = true; document.body.style.overflow = ""; };
  const passo = (n) => { pos = (pos + n + lista.length) % lista.length; mostrar(); };

  document.addEventListener("click", (e) => {
    const alvo = e.target.closest("img[data-lb]");
    if (!alvo) return;
    const grupo = [...alvo.closest(".galeria").querySelectorAll("img[data-lb]")];
    abrir(grupo, grupo.indexOf(alvo));
  });
  $(".lb-fechar").onclick = fechar;
  $(".lb-prev").onclick = () => passo(-1);
  $(".lb-next").onclick = () => passo(1);
  box.addEventListener("click", (e) => { if (e.target === box) fechar(); });
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") fechar();
    if (e.key === "ArrowLeft") passo(-1);
    if (e.key === "ArrowRight") passo(1);
  });
}

/* ---------- início ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#ano").textContent = new Date().getFullYear();
  iniciarMenu();
  montarHistoria();
  montarLiderancas();
  montarEventos();
  montarCultos();
  montarRedes();
  montarMidia();
  iniciarLightbox();
});
