/* =========================================================
   figuras.js — figuras ilustrativas dos exercícios
   =========================================================
   Motor de bonecos vetoriais. Cada exercício vira um SVG com dois
   quadros (início e fim do movimento) que se alternam em flipbook:
   o quadro ativo aparece sólido e o outro fica de fantasma atrás,
   então dá para ver a amplitude inteira do movimento parada na tela.

   Não há imagem binária nenhuma: tudo é desenhado por código, então
   o app continua funcionando offline e a figura acompanha o tema.

   Como as poses são escritas
   --------------------------
   Uma pose é descrita por ÂNGULOS de articulação, não por coordenadas
   soltas — é assim que um corpo se move e é muito mais fácil de acertar.

     p    [x,y] da pelve. Chão em y=140, quadril em pé fica em y≈78.
     tr   ângulo do tronco (90 = ereto, 0 = deitado de bruços para a
          direita, 180 = deitado de costas para a direita).
     cab  inclinação da cabeça, somada ao tronco (0 = alinhada).
     bd   braço da frente: [ângulo do braço, ângulo do antebraço].
     be   braço de trás (desenhado mais fino, para dar profundidade).
     pd   perna da frente: [ângulo da coxa, ângulo da canela].
     pe   perna de trás.
     esc  meia-largura dos ombros. 0 = vista de perfil, ~10 = de frente.

   Convenção de ângulo: 0° aponta para a direita, 90° para cima,
   -90° para baixo. Ângulos são ABSOLUTOS (em relação ao mundo, não ao
   segmento anterior) — em pé, braço e antebraço são os dois -90.

   O boneco olha para a DIREITA nas vistas de perfil.
   ========================================================= */
(function (global) {
  "use strict";

  /* ---- Proporções (em unidades do viewBox 200x150) ---- */
  const L = {
    tronco: 34, pescoco: 10, cabeca: 8.5,
    braco: 18, antebraco: 17,
    coxa: 23, canela: 23, pe: 9
  };
  const CHAO = 140;

  /* ---- Geometria ---- */
  const rad = a => a * Math.PI / 180;
  function seg(p, ang, len) { return [p[0] + len * Math.cos(rad(ang)), p[1] - len * Math.sin(rad(ang))]; }
  const n1 = v => Math.round(v * 10) / 10;

  /* Cinemática inversa de dois segmentos. Em vez de adivinhar dois ângulos
     até o pé cair no chão, a pose diz onde a MÃO ou o PÉ tem que estar
     (`bdT`/`pdT`) e isso resolve os ângulos. `dobra` (+1/-1) escolhe para
     que lado o cotovelo ou o joelho aponta. */
  function ik(orig, alvo, l1, l2, dobra) {
    const dx = alvo[0] - orig[0], dy = alvo[1] - orig[1];
    const dir = Math.atan2(-dy, dx) * 180 / Math.PI;
    let d = Math.hypot(dx, dy);
    const min = Math.abs(l1 - l2) + 0.6, max = l1 + l2 - 0.4;
    if (d > max) d = max; if (d < min) d = min;
    const cosA = (d * d + l1 * l1 - l2 * l2) / (2 * d * l1);
    const alpha = Math.acos(Math.max(-1, Math.min(1, cosA))) * 180 / Math.PI;
    const a1 = dir + (dobra == null ? 1 : dobra) * alpha;
    const meio = seg(orig, a1, l1);
    const a2 = Math.atan2(-(alvo[1] - meio[1]), alvo[0] - meio[0]) * 180 / Math.PI;
    return [a1, a2];
  }

  /* Resolve uma pose em ângulos para um esqueleto em coordenadas. */
  function esqueleto(q) {
    const p = q.p || [100, 78];
    const tr = q.tr == null ? 90 : q.tr;
    const esc = q.esc || 0;
    const pesc = esc * 0.75;
    /* Vista de perfil (esc=0): sem isso o braço e a perna de trás ficariam
       exatamente por cima dos da frente e a figura viraria um risco só.
       O lado de trás recua alguns pixels, que é o que o olho espera de
       um corpo visto de lado. */
    const dz = esc ? 0 : (q.dz == null ? 5.5 : q.dz);
    /* `dzy` empilha o lado de trás na vertical. Serve para pose vista de cima,
       onde as duas pernas fazem a mesma forma e precisam aparecer uma acima da
       outra (90/90) em vez de uma em cima da outra. */
    const dzy = q.dzy || 0;
    const recua = t => t ? [t[0] - dz, t[1] + dzy] : t;

    const pelve = p;
    const nuca = seg(pelve, tr, L.tronco);
    const cabeca = seg(nuca, tr + (q.cab || 0), L.pescoco);

    // Ombros e quadris deslocados na horizontal (só importa na vista frontal)
    const ombroD = [nuca[0] + esc, nuca[1]], ombroE = [nuca[0] - esc - dz, nuca[1] + dzy];
    const quadD = [pelve[0] + pesc, pelve[1]], quadE = [pelve[0] - pesc - dz, pelve[1] + dzy];

    function membro(orig, ang, alvo, dobra, l1, l2) {
      if (alvo) ang = ik(orig, alvo, l1, l2, dobra);
      if (!ang) return null;
      const meio = seg(orig, ang[0], l1);
      const fim = seg(meio, ang[1], l2);
      return [orig, meio, fim];
    }
    function pedaco(perna, angPe) {
      if (!perna) return null;
      return seg(perna[2], angPe == null ? 0 : angPe, L.pe);
    }

    const bd = membro(ombroD, q.bd, q.bdT, q.bdD, L.braco, L.antebraco);
    const be = membro(ombroE, q.be, recua(q.beT), q.beD, L.braco, L.antebraco);
    const pd = membro(quadD, q.pd, q.pdT, q.pdD, L.coxa, L.canela);
    const pe = membro(quadE, q.pe, recua(q.peT), q.peD, L.coxa, L.canela);

    return {
      pelve, nuca, cabeca, tr, raio: L.cabeca, arco: q.arco || 0,
      bd, be, pd, pe,
      pontaD: pedaco(pd, q.ped), pontaE: pedaco(pe, q.pee),
      maoD: bd && bd[2], maoE: be && be[2]
    };
  }

  /* ---- Desenho ---- */
  function poli(pts, cls) {
    return '<polyline class="' + cls + '" points="' +
      pts.map(t => n1(t[0]) + "," + n1(t[1])).join(" ") + '"/>';
  }
  function linha(a, b, cls) {
    return '<line class="' + cls + '" x1="' + n1(a[0]) + '" y1="' + n1(a[1]) +
      '" x2="' + n1(b[0]) + '" y2="' + n1(b[1]) + '"/>';
  }
  function circ(c, r, cls) {
    return '<circle class="' + cls + '" cx="' + n1(c[0]) + '" cy="' + n1(c[1]) + '" r="' + n1(r) + '"/>';
  }

  /* Tronco. Normalmente uma reta; com `arco` vira uma curva, que é o que
     permite desenhar coluna arqueada (gato-camelo), hollow body e a
     diferença entre prancha firme e prancha caindo no quadril. O sinal
     de `arco` empurra a curva para um lado ou para o outro do tronco. */
  function coluna(e) {
    const a = e.pelve, b = e.nuca;
    if (!e.arco) return linha(a, b, "mb");
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    const cx = (a[0] + b[0]) / 2 - (dy / len) * e.arco;
    const cy = (a[1] + b[1]) / 2 + (dx / len) * e.arco;
    return '<path class="mb" d="M' + n1(a[0]) + ' ' + n1(a[1]) + ' Q' + n1(cx) + ' ' + n1(cy) +
      ' ' + n1(b[0]) + ' ' + n1(b[1]) + '"/>';
  }

  function corpo(e) {
    let s = "";
    // Membros de trás primeiro, para o corpo passar por cima deles
    if (e.pe) s += poli(e.pe, "mb-tras");
    if (e.pontaE) s += linha(e.pe[2], e.pontaE, "mb-tras");
    if (e.be) s += poli(e.be, "mb-tras");

    s += coluna(e);
    if (e.pd) s += poli(e.pd, "mb");
    if (e.pontaD) s += linha(e.pd[2], e.pontaD, "mb");
    if (e.bd) s += poli(e.bd, "mb");
    s += circ(e.cabeca, e.raio, "cab");
    return s;
  }

  /* ---- Equipamento ----
     Cada função devolve SVG. São formas simples, propositalmente
     esquemáticas: a figura tem que dizer "é isso aqui", não ser bonita. */
  const EQ = {
    chao: () => '<line class="chao" x1="6" y1="' + CHAO + '" x2="194" y2="' + CHAO + '"/>',

    parede: (x, de, ate) => '<line class="fix" x1="' + x + '" y1="' + (de == null ? 12 : de) +
      '" x2="' + x + '" y2="' + (ate == null ? CHAO : ate) + '"/>',

    espaldar: x => {
      let s = '<line class="fix" x1="' + x + '" y1="14" x2="' + x + '" y2="' + CHAO + '"/>';
      const d = x > 100 ? 16 : -16;
      s += '<line class="fix" x1="' + (x + d) + '" y1="14" x2="' + (x + d) + '" y2="' + CHAO + '"/>';
      for (let y = 22; y < CHAO; y += 15) s += '<line class="fix" x1="' + x + '" y1="' + y + '" x2="' + (x + d) + '" y2="' + y + '"/>';
      return s;
    },

    // Banco: tampo em (x,y) com largura w, inclinação incl (graus, positivo = encosto subindo)
    banco: (x, y, w, incl) => {
      const a = incl || 0, hw = (w || 60) / 2;
      const A = seg([x, y], 180 + a, hw), B = seg([x, y], a, hw);
      return '<line class="fix gr" x1="' + n1(A[0]) + '" y1="' + n1(A[1]) + '" x2="' + n1(B[0]) + '" y2="' + n1(B[1]) + '"/>' +
        '<line class="fix" x1="' + n1(A[0] + 5) + '" y1="' + n1(A[1] + 2) + '" x2="' + n1(A[0] + 5) + '" y2="' + CHAO + '"/>' +
        '<line class="fix" x1="' + n1(B[0] - 5) + '" y1="' + n1(B[1] + 2) + '" x2="' + n1(B[0] - 5) + '" y2="' + CHAO + '"/>';
    },

    barraFixa: y => '<line class="fix gr" x1="30" y1="' + y + '" x2="170" y2="' + y + '"/>' +
      '<line class="fix" x1="34" y1="' + y + '" x2="34" y2="10"/>' +
      '<line class="fix" x1="166" y1="' + y + '" x2="166" y2="10"/>',

    // Argolas penduradas: centro cx, largura entre elas d, altura y
    argolas: (cx, d, y) => {
      const x1 = cx - d / 2, x2 = cx + d / 2;
      return '<line class="fix gr" x1="' + (x1 - 20) + '" y1="10" x2="' + (x2 + 20) + '" y2="10"/>' +
        '<line class="fix" x1="' + x1 + '" y1="10" x2="' + x1 + '" y2="' + (y - 6) + '"/>' +
        '<line class="fix" x1="' + x2 + '" y1="10" x2="' + x2 + '" y2="' + (y - 6) + '"/>' +
        '<circle class="fix" cx="' + x1 + '" cy="' + y + '" r="6" fill="none"/>' +
        '<circle class="fix" cx="' + x2 + '" cy="' + y + '" r="6" fill="none"/>';
    },

    // Tiras (TRX / elástico ancorado no alto)
    tiras: (cx, d, y) => {
      const x1 = cx - d / 2, x2 = cx + d / 2;
      return '<line class="fix gr" x1="' + (x1 - 16) + '" y1="10" x2="' + (x2 + 16) + '" y2="10"/>' +
        '<line class="fix" x1="' + cx + '" y1="10" x2="' + x1 + '" y2="' + y + '"/>' +
        '<line class="fix" x1="' + cx + '" y1="10" x2="' + x2 + '" y2="' + y + '"/>';
    },

    // Tecido acrobático: duas faixas caindo do teto
    tecido: (cx, d) => {
      const x1 = cx - d / 2, x2 = cx + d / 2;
      return '<line class="fix gr" x1="' + (x1 - 14) + '" y1="10" x2="' + (x2 + 14) + '" y2="10"/>' +
        '<path class="fix esp" d="M' + x1 + ' 10 C' + (x1 - 7) + ' 55,' + (x1 + 6) + ' 95,' + (x1 - 3) + ' ' + CHAO + '"/>' +
        '<path class="fix esp" d="M' + x2 + ' 10 C' + (x2 + 7) + ' 55,' + (x2 - 6) + ' 95,' + (x2 + 3) + ' ' + CHAO + '"/>';
    },

    // Gaiola / rack
    gaiola: () => '<line class="fix" x1="28" y1="16" x2="28" y2="' + CHAO + '"/>' +
      '<line class="fix" x1="172" y1="16" x2="172" y2="' + CHAO + '"/>' +
      '<line class="fix gr" x1="28" y1="16" x2="172" y2="16"/>',

    rolo: (x, y) => '<circle class="fix" cx="' + x + '" cy="' + y + '" r="9" fill="none"/>' +
      '<line class="fix" x1="' + (x - 5) + '" y1="' + (y - 4) + '" x2="' + (x + 5) + '" y2="' + (y + 4) + '"/>',

    saco: x => '<line class="fix" x1="' + x + '" y1="8" x2="' + x + '" y2="34"/>' +
      '<rect class="fix gr" x="' + (x - 11) + '" y="34" width="22" height="72" rx="9" fill="none"/>',

    pera: x => '<line class="fix gr" x1="' + (x - 26) + '" y1="26" x2="' + (x + 26) + '" y2="26"/>' +
      '<ellipse class="fix gr" cx="' + x + '" cy="42" rx="12" ry="14" fill="none"/>',

    bike: (x, y) => '<circle class="fix" cx="' + (x - 24) + '" cy="' + (CHAO - 15) + '" r="15" fill="none"/>' +
      '<circle class="fix" cx="' + (x + 26) + '" cy="' + (CHAO - 9) + '" r="9" fill="none"/>' +
      '<line class="fix gr" x1="' + (x - 24) + '" y1="' + (CHAO - 15) + '" x2="' + (x + 26) + '" y2="' + (CHAO - 9) + '"/>' +
      '<line class="fix gr" x1="' + (x - 20) + '" y1="' + (CHAO - 30) + '" x2="' + (x + 4) + '" y2="' + y + '"/>' +
      '<line class="fix gr" x1="' + (x + 22) + '" y1="' + (y + 14) + '" x2="' + (x + 30) + '" y2="' + (y + 8) + '"/>' +
      '<line class="fix" x1="' + (x + 14) + '" y1="' + (y + 8) + '" x2="' + (x + 34) + '" y2="' + (y + 8) + '"/>',

    // Batente / quina de porta
    batente: x => '<line class="fix gr" x1="' + x + '" y1="14" x2="' + x + '" y2="' + CHAO + '"/>' +
      '<line class="fix" x1="' + (x + 9) + '" y1="14" x2="' + (x + 9) + '" y2="' + CHAO + '"/>',

    // Corda de pular: arco por cima da cabeça / por baixo dos pés
    cordaAlta: (x, y) => '<path class="corda" d="M' + (x - 26) + ' ' + y + ' Q' + x + ' ' + (y - 62) + ' ' + (x + 26) + ' ' + y + '"/>',
    bola: (x, y) => '<circle class="corda" cx="' + x + '" cy="' + y + '" r="4.5" fill="none"/>',

    cordaBaixa: (x, y) => '<path class="corda" d="M' + (x - 26) + ' ' + y + ' Q' + x + ' ' + (CHAO + 8) + ' ' + (x + 26) + ' ' + y + '"/>'
  };

  /* ---- Carga nas mãos ---- */
  function anilha(c, r) {
    return '<line class="carga" x1="' + n1(c[0]) + '" y1="' + n1(c[1] - r) + '" x2="' + n1(c[0]) + '" y2="' + n1(c[1] + r) + '"/>';
  }
  function halterEm(m) {
    if (!m) return "";
    return '<line class="carga" x1="' + n1(m[0] - 8) + '" y1="' + n1(m[1]) + '" x2="' + n1(m[0] + 8) + '" y2="' + n1(m[1]) + '"/>' +
      anilha([m[0] - 8, m[1]], 5) + anilha([m[0] + 8, m[1]], 5);
  }
  function barraEm(m) {
    if (!m) return "";
    return '<line class="carga" x1="' + n1(m[0] - 34) + '" y1="' + n1(m[1]) + '" x2="' + n1(m[0] + 34) + '" y2="' + n1(m[1]) + '"/>' +
      anilha([m[0] - 30, m[1]], 11) + anilha([m[0] + 30, m[1]], 11) +
      anilha([m[0] - 25, m[1]], 8) + anilha([m[0] + 25, m[1]], 8);
  }
  function elasticoAte(m, anc) {
    if (!m) return "";
    const dx = (m[0] - anc[0]) / 4, dy = (m[1] - anc[1]) / 4;
    let d = "M" + n1(anc[0]) + " " + n1(anc[1]);
    for (let i = 1; i <= 4; i++) {
      const px = anc[0] + dx * i, py = anc[1] + dy * i;
      d += " Q" + n1(px - dx / 2 + (i % 2 ? 5 : -5)) + " " + n1(py - dy / 2 + (i % 2 ? -5 : 5)) + " " + n1(px) + " " + n1(py);
    }
    return '<path class="elast" d="' + d + '"/>';
  }

  function carga(e, tipo, anc) {
    if (!tipo) return "";
    switch (tipo) {
      case "barra": return barraEm(e.maoD || e.maoE);
      // Agachamento: a barra apoia no trapézio, não na mão
      case "barraCostas": return barraEm([e.nuca[0], e.nuca[1] + 1]);
      // Elevação pélvica: a barra atravessa o quadril
      case "barraQuadril": return barraEm([e.pelve[0], e.pelve[1] - 2]);
      case "halter": return halterEm(e.maoD) + halterEm(e.maoE);
      case "halter1": return halterEm(e.maoD);
      case "kb": {
        const m = e.maoD; if (!m) return "";
        return '<path class="carga" d="M' + n1(m[0] - 5) + ' ' + n1(m[1]) + ' q5 -8 10 0"/>' +
          '<circle class="carga" cx="' + n1(m[0]) + '" cy="' + n1(m[1] + 8) + '" r="7" fill="none"/>';
      }
      case "elastico": {
        const a = anc || [20, CHAO - 4];
        return elasticoAte(e.maoD, a) + (e.maoE ? elasticoAte(e.maoE, a) : "");
      }
      case "elasticoMaos": // elástico esticado entre as duas mãos
        return e.maoD && e.maoE ? elasticoAte(e.maoD, e.maoE) : "";
      case "elasticoPernas": { // elástico acima dos joelhos
        const a = e.pd && e.pd[1], b = e.pe && e.pe[1];
        if (!a) return "";
        if (!b || Math.hypot(a[0] - b[0], a[1] - b[1]) < 16) {
          // Joelhos quase juntos: a onda do elástico viraria um rabisco.
          // Uma alça em volta dos dois lê melhor.
          const c = b ? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] : a;
          return '<ellipse class="elast" cx="' + n1(c[0]) + '" cy="' + n1(c[1]) +
            '" rx="11" ry="6.5" fill="none"/>';
        }
        return elasticoAte(a, b);
      }
      default: return "";
    }
  }

  /* ---- Seta de movimento ---- */
  function seta(de, para) {
    if (!de || !para) return "";
    const dx = para[0] - de[0], dy = para[1] - de[1];
    const dist = Math.hypot(dx, dy);
    if (dist < 12) return "";
    // encurta as pontas para a seta não encostar no corpo
    const k = 9 / dist;
    const a = [de[0] + dx * k, de[1] + dy * k], b = [para[0] - dx * k, para[1] - dy * k];
    // arco leve, para leitura de movimento e não de translação rígida
    const mx = (a[0] + b[0]) / 2 - dy * 0.16, my = (a[1] + b[1]) / 2 + dx * 0.16;
    return '<path class="seta" d="M' + n1(a[0]) + ' ' + n1(a[1]) + ' Q' + n1(mx) + ' ' + n1(my) + ' ' + n1(b[0]) + ' ' + n1(b[1]) + '" marker-end="url(#figSeta)"/>';
  }

  /* ---- Montagem de um exercício ---- */
  function ponto(e, alvo) {
    switch (alvo) {
      case "mao": return e.maoD || e.maoE;
      case "maoE": return e.maoE;
      case "quad": return e.pelve;
      case "cab": return e.cabeca;
      case "pe": return e.pontaD || (e.pd && e.pd[2]);
      case "joelho": return e.pd && e.pd[1];
      case "nuca": return e.nuca;
      default: return null;
    }
  }

  function formas(lista) {
    return (lista || []).map(x => typeof x === "string"
      ? (EQ[x] ? EQ[x]() : "")
      : (EQ[x[0]] ? EQ[x[0]].apply(null, x.slice(1)) : "")).join("");
  }

  function quadro(f, cls, fixo, def) {
    const e = esqueleto(f);
    const tipo = f.carga !== undefined ? f.carga : def.carga;
    const anc = f.anc || def.anc;
    return '<g class="' + cls + '">' + (fixo || "") + formas(f.eq) + carga(e, tipo, anc) + corpo(e) + "</g>";
  }

  /* Caixa que contém tudo que foi desenhado. Serve para o SVG se ajustar ao
     exercício em vez de usar sempre 200x150: um exercício deitado ocupa uma
     faixa larga e baixa, e sem isso sobraria meia tela em branco por cima
     dele no modal. Lê as coordenadas do próprio SVG já montado — assim vale
     para corpo, equipamento e carga sem cada um ter que reportar seu tamanho. */
  function caixa(svgInterno) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, achou = false;
    const p = (x, y) => {
      if (!isFinite(x) || !isFinite(y)) return;
      achou = true;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    };
    svgInterno.replace(/points="([^"]+)"/g, (_, pts) =>
      pts.trim().split(/\s+/).forEach(t => { const c = t.split(","); p(+c[0], +c[1]); }));
    svgInterno.replace(/x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)"/g,
      (_, a, b, c, d) => { p(+a, +b); p(+c, +d); });
    svgInterno.replace(/cx="([-\d.]+)" cy="([-\d.]+)" r(?:x)?="([-\d.]+)"/g,
      (_, a, b, r) => { p(+a - +r, +b - +r); p(+a + +r, +b + +r); });
    svgInterno.replace(/<path[^>]*d="([^"]+)"/g, (_, d) =>
      (d.replace(/,/g, " ").match(/-?[\d.]+\s+-?[\d.]+/g) || []).forEach(par => {
        const c = par.split(/\s+/); p(+c[0], +c[1]);
      }));
    svgInterno.replace(/<rect[^>]*x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)"/g,
      (_, a, b, w, hh) => { p(+a, +b); p(+a + +w, +b + +hh); });
    if (!achou) return [0, 0, 200, 150];

    y1 = Math.max(y1, CHAO);                 // o chão sempre entra: é a referência
    const pad = 9;
    x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
    let w = x1 - x0, h = y1 - y0;
    /* Limites de proporção. O SVG ocupa a largura do cartão, então a altura na
       tela é ditada pela proporção do viewBox: sem teto, um exercício em pé
       tomaria meia tela e um deitado viraria um risco fino. Sobra vira margem,
       nunca esticão. */
    const wMin = h * 1.25;
    if (w < wMin) { x0 -= (wMin - w) / 2; w = wMin; }
    const hMin = w * 0.42;
    if (h < hMin) { y0 -= (hMin - h) / 2; h = hMin; }
    return [x0, y0, w, h];
  }

  function svgDe(def) {
    const A = def.A, B = def.B || def.A;
    const fixo = formas(def.eq);
    const eA = esqueleto(A), eB = esqueleto(B);
    const s = def.seta === null ? "" : seta(ponto(eA, def.seta || "mao"), ponto(eB, def.seta || "mao"));

    const dentro = quadro(A, "fq fq-a", fixo, def) + quadro(B, "fq fq-b", fixo, def) + s;
    const vb = caixa(dentro).map(n1);
    const k = Math.max(0.55, Math.min(1.15, vb[2] / 200));
    const chao = '<line class="chao" x1="' + n1(vb[0] + 3) + '" y1="' + CHAO +
      '" x2="' + n1(vb[0] + vb[2] - 3) + '" y2="' + CHAO + '"/>';

    return '<svg class="figura" viewBox="' + vb.join(" ") + '" style="--figk:' + n1(k) +
      '" role="img" aria-label="' +
      (def.alt || "Ilustração do exercício").replace(/"/g, "") + '">' +
      '<defs><marker id="figSeta" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="' +
      n1(9 * k) + '" markerHeight="' + n1(9 * k) + '" markerUnits="userSpaceOnUse" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z" class="setaP"/></marker></defs>' +
      chao + dentro +
      "</svg>";
  }

  /* =========================================================
     API
     ========================================================= */
  const API = {
    /* Devolve o HTML da figura de um exercício, ou "" se não houver. */
    html: function (nome) {
      const d = global.FIGURAS_DEF && global.FIGURAS_DEF[nome];
      if (!d) return "";
      return '<figure class="figbox">' + svgDe(d) +
        (d.leg ? '<figcaption>' + d.leg + '</figcaption>' : '') + '</figure>';
    },
    tem: function (nome) { return !!(global.FIGURAS_DEF && global.FIGURAS_DEF[nome]); },
    nomes: function () { return Object.keys(global.FIGURAS_DEF || {}); },
    _svg: svgDe, _esqueleto: esqueleto, _L: L, _CHAO: CHAO
  };

  global.FIGURAS = API;
})(typeof window !== "undefined" ? window : this);
