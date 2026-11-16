// Setas e textos ancorados no panorama (marcadores do Pannellum): acompanham o 360 quando a vista gira.
// Usado pelo visualizador (tour) e pelo editor.
(function (global) {
  const SVG_NS = "http://www.w3.org/2000/svg";

  function arrowSvg(color, sizePx) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("width", sizePx);
    svg.setAttribute("height", sizePx);
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", "M50 6 L92 52 L66 52 L66 94 L34 94 L34 52 L8 52 Z");
    p.setAttribute("fill", color);
    p.setAttribute("stroke", "rgba(0,0,0,.55)");
    p.setAttribute("stroke-width", "5");
    p.setAttribute("stroke-linejoin", "round");
    svg.appendChild(p);
    return svg;
  }

  function chevronSvg(sizePx) {
    // seta de chão estilo Street View: chevron largo, "deitado" via CSS (perspectiva)
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 120 80");
    svg.setAttribute("width", sizePx * 1.2);
    svg.setAttribute("height", sizePx * 0.8);
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", "M10 70 L60 14 L110 70 L84 70 L60 43 L36 70 Z");
    p.setAttribute("fill", "#ffffff");
    p.setAttribute("stroke", "rgba(0,0,0,.5)");
    p.setAttribute("stroke-width", "4");
    p.setAttribute("stroke-linejoin", "round");
    svg.appendChild(p);
    return svg;
  }

  // Preenche o div do marcador conforme o tipo da anotação.
  function render(base, a) {
    // o contêiner do Pannellum tem tamanho zero e fica no ponto exato; o conteúdo vai num elemento interno
    base.replaceChildren();
    const div = document.createElement("div");
    div.className = "ann ann-" + a.kind;
    base.appendChild(div);
    const size = Math.round(56 * (a.size || 1));
    if (a.kind === "link") {
      const floor = document.createElement("div");
      floor.className = "ann-floor";
      floor.appendChild(chevronSvg(size));
      div.appendChild(floor);
      const t = document.createElement("div");
      t.className = "ann-caption";
      t.textContent = a.text || a.target_title || "Próximo ponto";
      div.appendChild(t);
      base.title = "Ir para " + (a.target_title || a.text || "o próximo ponto");
    } else if (a.kind === "arrow") {
      const wrap = document.createElement("div");
      wrap.className = "ann-arrow";
      wrap.style.transform = "rotate(" + (a.rotation || 0) + "deg)";
      wrap.appendChild(arrowSvg(a.color || "#ffffff", size));
      div.appendChild(wrap);
      if (a.text) {
        const t = document.createElement("div");
        t.className = "ann-caption";
        t.textContent = a.text;
        div.appendChild(t);
      }
    } else {
      const t = document.createElement("div");
      t.className = "ann-label";
      t.style.color = a.color || "#ffffff";
      t.style.fontSize = Math.round(16 * (a.size || 1)) + "px";
      t.textContent = a.text || "";
      div.appendChild(t);
    }
    return div;
  }

  // Converte uma anotação (formato da API) num marcador do Pannellum.
  function toHotspot(a, extra) {
    const hs = {
      id: a.id,
      pitch: a.pitch,
      yaw: a.yaw,
      cssClass: "ann-hs",
      createTooltipFunc: render,
      createTooltipArgs: a,
    };
    if (a.kind === "link" && a.target_id) {
      hs.type = "scene";
      hs.sceneId = a.target_id;
      if (a.arrival_yaw !== null && a.arrival_yaw !== undefined) hs.targetYaw = a.arrival_yaw;
    } else {
      hs.type = "info";
    }
    return Object.assign(hs, extra || {});
  }

  // Maior textura que a GPU aceita; um JPEG 8K não carrega como textura única em muitos celulares.
  function maxTexture() {
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0;
    } catch (e) { return 0; }
  }

  // Configuração de imagem de um ponto: tiles multirresolução se houver; senão a imagem inteira ou a prévia.
  async function imageConfig(s) {
    if (s.tiles_url) {
      try {
        const r = await fetch(s.tiles_url + "/config.json");
        if (r.ok) {
          const tiles = await r.json();
          tiles.multiRes.basePath = s.tiles_url;
          return tiles;
        }
      } catch (e) { /* cai para a imagem equiretangular */ }
    }
    const width = s.width || 8192;
    const useFull = maxTexture() >= width / 2 || !s.preview_url;
    return { type: "equirectangular", panorama: useFull ? s.panorama_url : s.preview_url };
  }

  global.Ann = { render: render, toHotspot: toHotspot, imageConfig: imageConfig };
})(window);
