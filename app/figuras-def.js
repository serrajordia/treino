/* =========================================================
   Poses dos exercícios — dados para o motor de figuras.js
   =========================================================
   Cada chave tem que bater EXATAMENTE com uma chave de INSTR nos
   arquivos data/*.json. Há teste automatizado que falha se sobrar
   exercício sem figura.

   Referências rápidas: chão em y=140, pelve em pé em y=94, ombros em
   y=60, mão pendurada em y=95. O boneco olha para a direita.
   Onde a posição importa (pé no chão, mão na barra) a pose usa alvo
   `pdT`/`bdT` e o motor resolve os ângulos.
   ========================================================= */
(function (global) {
  "use strict";

  const CH = 140;                       // chão
  const EMPE = { p: [100, 94], tr: 90, bd: [-90, -90], be: [-90, -90], pd: [-85, -88], pe: [-95, -92], ped: 0, pee: 0 };
  const p = (o) => Object.assign({}, EMPE, o);       // pose a partir de "em pé"
  const px = (base, o) => Object.assign({}, base, o); // pose a partir de outra

  /* ---- Poses recorrentes ---- */
  const AGACHADO = p({ p: [92, 112], tr: 62, pdT: [102, CH], peT: [102, CH], pd: null, pe: null, bd: [-90, -90], be: [-90, -90] });
  const DOBRADO = p({ p: [93, 96], tr: 22 });   // dobra de quadril (RDL / remada)
  const QUATRO = { p: [82, 117], tr: 20, bdT: [114, CH], bdD: -1, beT: [114, CH], beD: -1, pd: [-90, 180], pe: [-90, 180], ped: null, pee: null };
  const DEITADO = { p: [82, 128], tr: 0, bd: [-90, -90], be: [-90, -90], pd: [0, 0], pe: [0, 0], ped: null, pee: null };

  const D = {

    /* =====================================================
       AQUECIMENTO / MOBILIDADE
       ===================================================== */

    "90/90 (rotação de quadril)": {
      alt: "Sentado no chão com as pernas em 90/90, girando os joelhos de um lado para o outro",
      leg: "Gire os dois joelhos juntos, varrendo o chão — o movimento é de quadril.",
      seta: "joelho",
      /* Vista de cima: cada perna é um galo (>), as duas apontando para o
         mesmo lado. O `dz` maior separa a perna de trás para ler ">>". */
      A: { p: [96, 106], tr: 90, dz: 6, dzy: -15, bd: [-62, -86], be: [-118, -86], pd: [-28, 208], pe: [-28, 208], ped: null, pee: null },
      B: { p: [96, 106], tr: 90, dz: 6, dzy: -15, bd: [-62, -86], be: [-118, -86], pd: [208, -28], pe: [208, -28], ped: null, pee: null }
    },

    "Leg swings (balanço de perna)": {
      alt: "Em pé com uma mão no apoio, balançando a perna para a frente e para trás",
      leg: "Tronco parado, perna solta como pêndulo. Só ganhe amplitude aos poucos.",
      eq: [["espaldar", 168]], seta: "pe",
      A: p({ p: [96, 94], bd: [10, 8], pe: [-125, -100], pd: [-90, -90], ped: 0, pee: null }),
      B: p({ p: [96, 94], bd: [10, 8], pe: [-40, -20], pd: [-90, -90], ped: 0, pee: null })
    },

    "Monster walk com elástico": {
      alt: "Semiagachado de frente, elástico acima dos joelhos, dando passos laterais",
      leg: "Meio agachado, joelhos abertos contra o elástico. O passo é lateral, sem juntar os pés.",
      seta: "pe", carga: "elasticoPernas",
      A: p({ p: [100, 104], esc: 11, pdT: [110, CH], peT: [90, CH], pd: null, pe: null, bd: [-60, -30], be: [-120, -150] }),
      B: p({ p: [107, 104], esc: 11, pdT: [126, CH], peT: [92, CH], pd: null, pe: null, bd: [-60, -30], be: [-120, -150] })
    },

    "Clamshell com elástico": {
      alt: "Deitado de lado com joelhos dobrados, abrindo o joelho de cima contra o elástico",
      leg: "Pés encostados, quadril parado. Só o joelho de cima abre.",
      seta: "joelho", carga: "elasticoPernas",
      /* Mesma ideia do 90/90, mas o galo aponta para baixo e depois para cima:
         o pé fica parado e só o joelho sobe. */
      A: { p: [104, 118], tr: 0, dz: 9, cab: -60, bd: [-14, 30], be: [-14, 30], pd: [242, 158], pe: [242, 158], ped: null, pee: null },
      B: { p: [104, 118], tr: 0, dz: 9, cab: -60, bd: [-14, 30], be: [-14, 30], pd: [118, 202], pe: [242, 158], ped: null, pee: null }
    },

    "Corda de pular": {
      alt: "Pulando corda: corda passando por cima da cabeça e depois por baixo dos pés",
      leg: "Salto baixo, só o suficiente para a corda passar. Cotovelos junto ao corpo.",
      seta: null,
      A: p({ p: [100, 94], bd: [-70, -20], be: [-110, -160], eq: [["cordaAlta", 100, 96]] }),
      B: p({ p: [100, 86], pdT: [100, 132], peT: [100, 132], pd: null, pe: null, ped: -35, pee: -35, bd: [-70, -20], be: [-110, -160], eq: [["cordaBaixa", 100, 88]] })
    },

    "Malabarismo livre": {
      alt: "Em pé lançando bolinhas, uma no ar e as mãos na altura da cintura",
      leg: "Cotovelos junto ao corpo, lançamento até a altura dos olhos. Vale errar e recomeçar.",
      seta: null,
      A: p({ bd: [-40, 14], be: [-140, 166], eq: [["bola", 100, 42], ["bola", 122, 74], ["bola", 80, 82]] }),
      B: p({ bd: [-30, 34], be: [-150, 146], eq: [["bola", 100, 36], ["bola", 78, 72], ["bola", 124, 80]] })
    },

    "Mobilidade articular geral": {
      alt: "Em pé fazendo círculos amplos com os braços",
      leg: "Círculos crescentes em cada articulação, sem carga e sem pressa.",
      seta: "mao", A: p({ esc: 10, bd: [-30, 0], be: [-150, 180] }), B: p({ esc: 10, bd: [70, 100], be: [110, 80] })
    },

    "Gato-camelo": {
      alt: "Em quatro apoios, arqueando e arredondando a coluna",
      leg: "Arredonde empurrando o chão; depois solte a barriga e abra o peito. Só a coluna se move.",
      seta: null,
      A: px(QUATRO, { arco: -13, cab: -45 }),
      B: px(QUATRO, { arco: 13, cab: 40 })
    },

    "Dead hang na barra": {
      alt: "Pendurado na barra fixa com os braços estendidos",
      leg: "Solte o peso do corpo. Ombros longe das orelhas o suficiente para não afundar a cabeça.",
      eq: [["barraFixa", 26]], seta: null,
      A: { p: [100, 96], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -80], pe: [-90, -80], ped: -30, pee: -30 },
      B: { p: [100, 99], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -70], pe: [-90, -70], ped: -30, pee: -30 }
    },

    "Scapular pulls": {
      alt: "Pendurado na barra, subindo poucos centímetros só com as escápulas, braços esticados",
      leg: "Braços continuam esticados. Quem sobe é o corpo puxado pelas escápulas.",
      eq: [["barraFixa", 26]], seta: "cab",
      A: { p: [100, 99], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -80], pe: [-90, -80], ped: -30, pee: -30 },
      B: { p: [100, 90], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -80], pe: [-90, -80], ped: -30, pee: -30 }
    },

    "Rotação externa com elástico": {
      alt: "Em pé com o cotovelo colado no corpo a 90 graus, girando o antebraço para fora contra o elástico",
      leg: "Cotovelo colado na cintura o tempo todo. Gira o antebraço, não o tronco.",
      seta: "mao", carga: "elastico", anc: [24, 78],
      A: p({ bd: [-90, 178], be: [-90, -90] }),
      B: p({ bd: [-90, 8], be: [-90, -90] })
    },

    "Mobilidade de ombro e punho": {
      alt: "Em pé fazendo círculos de ombro e círculos de punho",
      leg: "Círculos lentos, primeiro pequenos e depois maiores, nos dois sentidos.",
      seta: "mao",
      A: p({ esc: 10, bd: [-20, 20], be: [-160, 160] }),
      B: p({ esc: 10, bd: [50, 95], be: [130, 85] })
    },

    "Shadow boxing leve": {
      alt: "Em guarda de boxe, estendendo um soco à frente",
      leg: "Guarda alta, queixo protegido, soco solto. Sem força — é aquecimento.",
      seta: "mao",
      A: p({ p: [98, 94], pdT: [112, CH], peT: [86, CH], pd: null, pe: null, bd: [-20, 60], be: [-30, 70] }),
      B: p({ p: [98, 94], pdT: [112, CH], peT: [86, CH], pd: null, pe: null, bd: [-4, 2], be: [-30, 70] })
    },

    "Wall slides no espaldar": {
      alt: "De costas para o espaldar, deslizando os braços para cima mantendo o contato",
      leg: "Punhos e cotovelos encostados o tempo todo. Onde perder o contato, é ali que a amplitude acaba.",
      eq: [["espaldar", 26]], seta: "mao",
      A: { p: [58, 94], tr: 90, esc: 0, bd: [178, 88], be: [178, 88], pd: [-90, -90], pe: [-90, -90], ped: 0, pee: 0 },
      B: { p: [58, 94], tr: 90, esc: 0, bd: [150, 110], be: [150, 110], pd: [-90, -90], pe: [-90, -90], ped: 0, pee: 0 }
    },

    "Ativação de manguito rotador com elástico": {
      alt: "Cotovelo colado no corpo a 90 graus, girando o antebraço para fora contra o elástico",
      leg: "Devagar e com pouca resistência. É ativação, não série de força.",
      seta: "mao", carga: "elastico", anc: [24, 78],
      A: p({ bd: [-90, 178], be: [-90, -90] }),
      B: p({ bd: [-90, 8], be: [-90, -90] })
    },

    "Falso apoio na argola": {
      alt: "Apoiado nas argolas baixas com os braços estendidos e os pés ainda no chão",
      leg: "Braços travados, argolas junto ao quadril, ombros para baixo. Os pés dividem o peso.",
      eq: [["argolas", 100, 40, 96]], seta: null,
      A: { p: [100, 106], tr: 90, bdT: [80, 96], beT: [120, 96], bdD: -1, beD: 1, pdT: [104, CH], peT: [96, CH], ped: 0, pee: 0 },
      B: { p: [100, 100], tr: 90, bdT: [80, 96], beT: [120, 96], bdD: -1, beD: 1, pdT: [106, CH], peT: [94, CH], ped: 0, pee: 0 }
    },

    "Alongamento de antebraço": {
      alt: "Braço estendido à frente, a outra mão puxando os dedos para trás",
      leg: "Cotovelo estendido. Puxe os dedos até sentir esticar, sem dor.",
      seta: null,
      A: p({ bd: [-6, 0], be: [-40, 20] }),
      B: p({ bd: [-6, 8], be: [-36, 24] })
    },

    "Mobilidade escapular": {
      alt: "Em quatro apoios, afundando e empurrando as escápulas",
      leg: "Braços travados. O tronco sobe e desce entre as escápulas.",
      seta: "nuca",
      A: px(QUATRO, { p: [82, 121], arco: -4 }),
      B: px(QUATRO, { p: [82, 113], arco: 5 })
    },

    "Dead hang curto (teste do dia)": {
      alt: "Pendurado na barra fixa com os braços estendidos, por poucos segundos",
      leg: "Poucos segundos, só para sentir como o corpo respondeu hoje.",
      eq: [["barraFixa", 26]], seta: null,
      A: { p: [100, 96], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -80], pe: [-90, -80], ped: -30, pee: -30 },
      B: { p: [100, 99], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -75], pe: [-90, -75], ped: -30, pee: -30 }
    },

    "Dead hang passivo (descompressão)": {
      alt: "Pendurado na barra fixa, totalmente relaxado, deixando a coluna alongar",
      leg: "Aqui é para relaxar mesmo: solte o corpo e deixe o peso alongar a coluna.",
      eq: [["barraFixa", 26]], seta: null,
      A: { p: [100, 99], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -78], pe: [-90, -78], ped: -30, pee: -30 },
      B: { p: [100, 102], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -72], pe: [-90, -72], ped: -30, pee: -30 }
    },

    "Bike leve": {
      alt: "Pedalando sentado na bicicleta ergométrica em ritmo leve",
      leg: "Ritmo de conversa. Serve para subir a temperatura, não para cansar.",
      eq: [["bike", 100, 82]], seta: "joelho",
      A: { p: [92, 88], tr: 66, bdT: [124, 90], beT: [124, 90], bdD: -1, beD: -1, pdT: [110, 108], peT: [86, 122], pdD: 1, peD: 1, ped: 10, pee: 10 },
      B: { p: [92, 88], tr: 66, bdT: [124, 90], beT: [124, 90], bdD: -1, beD: -1, pdT: [86, 122], peT: [110, 108], pdD: 1, peD: 1, ped: 10, pee: 10 }
    },

    "Bike ergométrica intervalada": {
      alt: "Pedalando na bicicleta ergométrica, alternando ritmo forte e ritmo leve",
      leg: "Alterne o esforço no tempo combinado. No trecho forte a respiração tem que pesar.",
      eq: [["bike", 100, 82]], seta: "joelho",
      A: { p: [92, 88], tr: 66, bdT: [124, 90], beT: [124, 90], bdD: -1, beD: -1, pdT: [110, 108], peT: [86, 122], pdD: 1, peD: 1, ped: 10, pee: 10 },
      B: { p: [92, 84], tr: 58, bdT: [124, 88], beT: [124, 88], bdD: -1, beD: -1, pdT: [86, 122], peT: [110, 106], pdD: 1, peD: 1, ped: 10, pee: 10 }
    },

    /* =====================================================
       ALONGAMENTOS
       ===================================================== */

    "Alongamento de flexor de quadril (afundo com retroversão)": {
      alt: "Afundo com o joelho de trás no chão, quadril encaixado embaixo",
      leg: "Encaixe o quadril embaixo (glúteo apertado) ANTES de avançar. É aí que estica na frente da coxa.",
      seta: "quad",
      A: { p: [96, 104], tr: 84, bd: [-60, -70], be: [-120, -110], pdT: [124, CH], peT: [74, CH], pdD: 1, peD: 1, ped: 0, pee: 80 },
      B: { p: [94, 100], tr: 96, bd: [-60, -70], be: [-120, -110], pdT: [124, CH], peT: [72, CH], pdD: 1, peD: 1, ped: 0, pee: 80 }
    },

    "Isquiotibiais no espaldar": {
      alt: "Em pé com o calcanhar apoiado num degrau do espaldar, inclinando o tronco à frente",
      leg: "Joelho da frente esticado. Incline pelo QUADRIL, não arredondando as costas.",
      eq: [["espaldar", 170]], seta: "nuca",
      A: { p: [104, 94], tr: 90, bd: [-70, -60], be: [-110, -120], pdT: [150, 100], pdD: -1, peT: [102, CH], peD: 1, ped: 0, pee: 0 },
      B: { p: [104, 96], tr: 52, bd: [-40, -30], be: [-60, -40], pdT: [150, 100], pdD: -1, peT: [102, CH], peD: 1, ped: 0, pee: 0 }
    },

    "Piriforme (figura 4)": {
      alt: "Deitado de costas com o tornozelo cruzado sobre o joelho oposto, puxando a coxa",
      leg: "Cruze o tornozelo sobre o joelho e puxe a coxa de baixo até sentir no glúteo.",
      seta: "joelho",
      A: { p: [80, 126], tr: 0, bd: [-40, -20], be: [-40, -20], pdT: [104, 106], pdD: -1, peT: [112, 122], peD: 1, ped: null, pee: null },
      B: { p: [80, 126], tr: 0, bdT: [96, 100], beT: [96, 100], bdD: 1, beD: 1, pdT: [92, 100], pdD: -1, peT: [104, 112], peD: 1, ped: null, pee: null }
    },

    "Mobilidade de tornozelo (joelho à parede)": {
      alt: "Em pé de frente para a parede, levando o joelho à parede com o calcanhar no chão",
      leg: "Calcanhar colado no chão. Afaste o pé até o joelho quase não alcançar a parede.",
      eq: [["parede", 158]], seta: "joelho",
      A: { p: [104, 92], tr: 84, bd: [-14, -8], be: [-20, -10], pdT: [124, CH], pdD: 1, peT: [98, CH], peD: 1, ped: 0, pee: 0 },
      B: { p: [102, 88], tr: 78, bd: [-14, -8], be: [-20, -10], pdT: [124, CH], pdD: 1, peT: [98, CH], peD: 1, ped: 0, pee: 0 }
    },

    "Dorsal no espaldar": {
      alt: "Segurando o espaldar com os braços estendidos e recuando o quadril",
      leg: "Braços esticados, quadril para trás. Estica a lateral das costas, das axilas ao quadril.",
      eq: [["espaldar", 172]], seta: "quad",
      A: { p: [110, 94], tr: 78, bdT: [156, 66], beT: [156, 66], bdD: -1, beD: -1, pdT: [110, CH], peT: [110, CH], ped: 0, pee: 0 },
      B: { p: [92, 104], tr: 34, bdT: [156, 66], beT: [156, 66], bdD: -1, beD: -1, pdT: [104, CH], peT: [104, CH], ped: 0, pee: 0 }
    },

    "Ombro em extensão (mãos atrás no banco)": {
      alt: "Sentado no chão de costas para o banco, mãos apoiadas atrás no tampo, deslizando o corpo à frente",
      leg: "Deslize o quadril à frente devagar. Pare no primeiro sinal de desconforto no ombro.",
      eq: [["banco", 62, 104, 56, 0]], seta: "quad",
      A: { p: [96, 118], tr: 84, bdT: [66, 102], beT: [66, 102], bdD: 1, beD: 1, pdT: [130, CH], peT: [130, CH], pdD: 1, peD: 1, ped: null, pee: null },
      B: { p: [108, 122], tr: 80, bdT: [66, 102], beT: [66, 102], bdD: 1, beD: 1, pdT: [142, CH], peT: [142, CH], pdD: 1, peD: 1, ped: null, pee: null }
    },

    "Extensão torácica sobre rolo": {
      alt: "Deitado de costas com um rolo sob as costas, abrindo o peito para trás",
      leg: "Rolo na parte de cima das costas. Apoie a cabeça nas mãos e abra o peito sobre ele.",
      eq: [["rolo", 105, 133]], seta: "cab",
      /* De barriga para cima: o rolo fica DEBAIXO da parte alta das costas e o
         joelho dobrado para cima com o pé no chão é o que diz "supino" e não
         "de bruços". No segundo quadro a cabeça cai para trás por cima do rolo. */
      A: { p: [122, 128], tr: 172, cab: 0, bd: [156, 150], be: [156, 150], pdT: [152, CH], peT: [152, CH], pdD: -1, peD: -1, ped: 0, pee: 0 },
      B: { p: [122, 128], tr: 172, cab: 32, arco: -7, bd: [174, 178], be: [174, 178], pdT: [152, CH], peT: [152, CH], pdD: -1, peD: -1, ped: 0, pee: 0 }
    },

    "Rotação torácica (open book)": {
      alt: "Deitado de lado com joelhos dobrados, abrindo o braço de cima para o outro lado",
      leg: "Joelhos parados no chão. Só o tronco de cima gira, acompanhando a mão.",
      seta: "mao",
      /* Deitado de lado: perna de baixo estendida, a de cima com joelho
         dobrado à frente. Os braços começam juntos apontando para o mesmo lado
         e abrem para lados opostos, os dois paralelos ao chão. */
      /* `dzy` desce o lado de trás: separa o braço de trás do da frente e joga a
         perna estendida para junto do chão, longe da linha dos braços — sem
         isso braço, tronco e perna caem todos na mesma altura e vira um risco. */
      A: { p: [104, 124], tr: 24, cab: -104, dzy: 9, bd: [10, 10], be: [10, 10], pe: [182, 180], pd: [-20, 200], ped: null, pee: null },
      B: { p: [104, 124], tr: 24, cab: -104, dzy: 9, bd: [10, 10], be: [170, 170], pe: [182, 180], pd: [-20, 200], ped: null, pee: null }
    },

    "Alongamento de deltoide posterior": {
      alt: "Em pé com o braço cruzado à frente do peito, a outra mão puxando o cotovelo",
      leg: "Braço reto cruzando o peito. Puxe pelo cotovelo, não pelo punho.",
      seta: null,
      A: p({ bd: [-90, -90], be: [-90, -90] }),
      B: p({ bd: [176, 172], be: [-150, 6] })
    },

    "Panturrilha": {
      alt: "Em passada com a perna de trás esticada e o calcanhar de trás no chão",
      leg: "Calcanhar de trás colado no chão e perna de trás esticada. Empurre o quadril à frente.",
      eq: [["parede", 160]], seta: null,
      A: { p: [98, 94], tr: 82, bd: [-10, -4], be: [-16, -6], pdT: [122, CH], pdD: 1, peT: [74, CH], peD: 1, ped: 0, pee: 0 },
      B: { p: [104, 92], tr: 78, bd: [-10, -4], be: [-16, -6], pdT: [128, CH], pdD: 1, peT: [74, CH], peD: 1, ped: 0, pee: 0 }
    },

    "Peitoral no batente (3 alturas de cotovelo)": {
      alt: "Antebraço apoiado no batente da porta, girando o tronco para o lado oposto",
      leg: "Antebraço fixo no batente. Gire o TRONCO para longe. Repita com o cotovelo baixo, na altura do ombro e alto.",
      eq: [["batente", 150]], seta: "nuca",
      A: { p: [104, 94], tr: 90, bdT: [150, 62], bdD: -1, be: [-100, -95], pdT: [110, CH], peT: [96, CH], ped: 0, pee: 0 },
      B: { p: [98, 94], tr: 100, bdT: [150, 62], bdD: -1, be: [-100, -95], pdT: [106, CH], peT: [92, CH], ped: 0, pee: 0 }
    },

    "Sleeper stretch leve (ombro direito)": {
      alt: "Deitado de lado sobre o ombro, cotovelo a 90 graus, girando o antebraço em direção ao chão",
      leg: "Bem leve. Desça o antebraço só até sentir tensão suave — esse aqui castiga se forçar.",
      seta: "mao",
      A: { p: [86, 126], tr: 4, bd: [4, 84], be: [170, 150], pd: [-16, 152], pe: [-16, 152], ped: null, pee: null },
      B: { p: [86, 126], tr: 4, bd: [4, 20], be: [170, 150], pd: [-16, 152], pe: [-16, 152], ped: null, pee: null }
    },

    "Alongamento de tríceps": {
      alt: "Em pé com a mão atrás da nuca e a outra mão empurrando o cotovelo para trás",
      leg: "Cotovelo apontando para cima; a outra mão só acompanha. Sem forçar o pescoço à frente.",
      seta: "mao",
      A: p({ bd: [80, 140], be: [-90, -90] }),
      B: p({ bd: [100, 190], be: [60, 20] })
    },

    "Flexores e extensores de antebraço": {
      alt: "Braço estendido à frente, a outra mão puxando os dedos para cima e depois para baixo",
      leg: "Cotovelo esticado. Puxe os dedos para cima e depois para baixo — os dois lados do antebraço.",
      seta: "mao",
      A: p({ bd: [-6, 22], be: [-40, 30] }),
      B: p({ bd: [-6, -20], be: [-40, -6] })
    },

    "Flexores e extensores de punho": {
      alt: "Braço estendido à frente, a outra mão puxando os dedos para cima e depois para baixo",
      leg: "Cotovelo esticado. Puxe os dedos para cima e depois para baixo — os dois lados do antebraço.",
      seta: "mao",
      A: p({ bd: [-6, 22], be: [-40, 30] }),
      B: p({ bd: [-6, -20], be: [-40, -6] })
    },

    "Extensor de antebraço": {
      alt: "Braço estendido à frente com a palma para baixo, a outra mão puxando os dedos para baixo",
      leg: "Palma para baixo, dedos puxados para baixo. Estica a parte de cima do antebraço.",
      seta: "mao",
      A: p({ bd: [-6, 0], be: [-40, 20] }),
      B: p({ bd: [-6, -24], be: [-40, -10] })
    },

    "Flexor de antebraço": {
      alt: "Braço estendido à frente com a palma para cima, a outra mão puxando os dedos para trás",
      leg: "Palma para cima, dedos puxados para trás. Estica a parte de baixo do antebraço.",
      seta: "mao",
      A: p({ bd: [-6, 0], be: [-40, 20] }),
      B: p({ bd: [-6, 26], be: [-40, 34] })
    },

    "Mobilidade de punho em quatro apoios": {
      alt: "Em quatro apoios com as mãos no chão, transferindo o peso para a frente e para trás",
      leg: "Palmas fixas no chão. Leve o peso à frente e volte, sem tirar a mão do chão.",
      seta: "nuca",
      A: px(QUATRO, { p: [78, 117] }),
      B: px(QUATRO, { p: [88, 117] })
    },

    "Respiração longa deitado": {
      alt: "Deitado de costas com os joelhos dobrados, respirando fundo",
      leg: "Inspire pelo nariz enchendo a barriga; solte o ar bem devagar pela boca.",
      seta: null,
      A: { p: [86, 128], tr: 0, arco: 0, bd: [-30, -10], be: [-30, -10], pdT: [126, CH], peT: [126, CH], pdD: -1, peD: -1, ped: null, pee: null },
      B: { p: [86, 128], tr: 0, arco: -4, bd: [-30, -10], be: [-30, -10], pdT: [126, CH], peT: [126, CH], pdD: -1, peD: -1, ped: null, pee: null }
    },

    "Caminhada ou alongamento leve": {
      alt: "Caminhando em ritmo leve",
      leg: "Ritmo leve e contínuo. É recuperação ativa, não treino.",
      seta: null,
      A: p({ p: [100, 94], pdT: [116, CH], peT: [86, CH], pd: null, pe: null, bd: [-114, -100], be: [-66, -80], ped: 0, pee: 0 }),
      B: p({ p: [100, 94], pdT: [86, CH], peT: [116, CH], pd: null, pe: null, bd: [-66, -80], be: [-114, -100], ped: 0, pee: 0 })
    },

    "Bloco de flexibilidade dirigida": {
      alt: "Sentado no chão com as pernas à frente, inclinando o tronco sobre elas",
      leg: "Segure cada posição respirando fundo. Ganho de amplitude vem do tempo, não da força.",
      seta: "nuca",
      A: { p: [88, 122], tr: 86, bd: [-30, -20], be: [-30, -20], pd: [-4, -2], pe: [-4, -2], ped: 60, pee: 60 },
      B: { p: [88, 122], tr: 44, bd: [-6, -4], be: [-6, -4], pd: [-4, -2], pe: [-4, -2], ped: 60, pee: 60 }
    },

    /* =====================================================
       PERNAS / QUADRIL
       ===================================================== */

    "Afundo búlgaro (apoio no banco)": {
      alt: "Afundo com o pé de trás apoiado no banco, descendo o joelho da frente",
      leg: "Peso na perna da frente. Desça reto — o pé de trás só equilibra.",
      eq: [["banco", 58, 112, 46, 0]], seta: "quad", carga: "halter",
      A: { p: [104, 94], tr: 84, bd: [-88, -90], be: [-92, -90], pdT: [118, CH], pdD: 1, peT: [62, 112], peD: 1, ped: 0, pee: null },
      B: { p: [102, 112], tr: 78, bd: [-88, -90], be: [-92, -90], pdT: [118, CH], pdD: 1, peT: [62, 112], peD: 1, ped: 0, pee: null }
    },

    "Afundo búlgaro": {
      alt: "Afundo com o pé de trás apoiado no banco, descendo o joelho da frente",
      leg: "Peso na perna da frente. Desça reto — o pé de trás só equilibra.",
      eq: [["banco", 58, 112, 46, 0]], seta: "quad", carga: "halter",
      A: { p: [104, 94], tr: 84, bd: [-88, -90], be: [-92, -90], pdT: [118, CH], pdD: 1, peT: [62, 112], peD: 1, ped: 0, pee: null },
      B: { p: [102, 112], tr: 78, bd: [-88, -90], be: [-92, -90], pdT: [118, CH], pdD: 1, peT: [62, 112], peD: 1, ped: 0, pee: null }
    },

    "Agachamento na gaiola hack": {
      alt: "Agachamento dentro da gaiola, descendo até a coxa paralela ao chão",
      leg: "Desça até a coxa pelo menos paralela. Joelhos na direção dos pés, sem cair para dentro.",
      eq: ["gaiola"], seta: "quad", carga: "barraCostas",
      A: p({ bd: [200, 125], be: [200, 125] }),
      B: px(AGACHADO, { bd: [200, 125], be: [200, 125] })
    },

    "Agachamento": {
      alt: "Agachamento com barra nas costas, descendo até a coxa paralela ao chão",
      leg: "Barra no trapézio, core travado. Desça o quadril para trás e para baixo; suba empurrando o chão.",
      eq: ["gaiola"], seta: "quad", carga: "barraCostas",
      A: p({ bd: [200, 125], be: [200, 125] }),
      B: px(AGACHADO, { bd: [200, 125], be: [200, 125] })
    },

    "Agachamento assistido na argola": {
      alt: "Agachamento segurando as argolas à frente para ajudar no equilíbrio",
      leg: "As argolas só dão equilíbrio — o peso continua nas pernas, não nos braços.",
      eq: [["argolas", 118, 34, 74]], seta: "quad",
      A: { p: [98, 94], tr: 88, bdT: [102, 74], beT: [136, 74], bdD: -1, beD: -1, pdT: [102, CH], peT: [102, CH], ped: 0, pee: 0 },
      B: px(AGACHADO, { p: [90, 112], tr: 70, bdT: [102, 74], beT: [136, 74], bdD: -1, beD: -1 })
    },

    "RDL unilateral com halteres": {
      alt: "Em pé sobre uma perna, dobrando o quadril com a outra perna estendida para trás",
      leg: "Perna de apoio quase reta. Quadril vai para trás e a perna livre sobe atrás como contrapeso.",
      seta: "mao", carga: "halter1",
      A: p({ p: [100, 94], bd: [-90, -90], be: [-90, -90], pd: [-90, -90], pe: [-96, -92], ped: 0, pee: 0 }),
      B: { p: [92, 96], tr: 16, bd: [-90, -90], be: [-90, -90], pdT: [96, CH], pdD: 1, pe: [166, 178], ped: 0, pee: null }
    },

    "Elevação pélvica (hip thrust) com barra": {
      alt: "Com as costas apoiadas no banco, elevando o quadril até o tronco ficar paralelo ao chão",
      leg: "Ombros no banco, pés firmes. Termine apertando o glúteo, sem estufar a lombar.",
      eq: [["banco", 146, 113, 44, 0]], seta: "quad", carga: "barraQuadril",
      /* Ombros no banco à direita, pés bem à FRENTE (à esquerda do quadril) e
         apontando para fora. Antes o pé caía embaixo do ombro e a coxa saía
         torta para trás. */
      A: { p: [92, 128], tr: 24, bdT: [140, 110], beT: [140, 110], bdD: 1, beD: 1, pdT: [62, CH], peT: [62, CH], pdD: -1, peD: -1, ped: 180, pee: 180 },
      B: { p: [92, 112], tr: 2, bdT: [140, 108], beT: [140, 108], bdD: 1, beD: 1, pdT: [62, CH], peT: [62, CH], pdD: -1, peD: -1, ped: 180, pee: 180 }
    },

    "Hip thrust": {
      alt: "Com as costas apoiadas no banco, elevando o quadril até o tronco ficar paralelo ao chão",
      leg: "Ombros no banco, pés firmes. Termine apertando o glúteo, sem estufar a lombar.",
      eq: [["banco", 146, 113, 44, 0]], seta: "quad", carga: "barraQuadril",
      /* Ombros no banco à direita, pés bem à FRENTE (à esquerda do quadril) e
         apontando para fora. Antes o pé caía embaixo do ombro e a coxa saía
         torta para trás. */
      A: { p: [92, 128], tr: 24, bdT: [140, 110], beT: [140, 110], bdD: 1, beD: 1, pdT: [62, CH], peT: [62, CH], pdD: -1, peD: -1, ped: 180, pee: 180 },
      B: { p: [92, 112], tr: 2, bdT: [140, 108], beT: [140, 108], bdD: 1, beD: 1, pdT: [62, CH], peT: [62, CH], pdD: -1, peD: -1, ped: 180, pee: 180 }
    },

    "Panturrilha em pé (apoio no espaldar)": {
      alt: "Em pé com a mão no apoio, subindo na ponta dos pés",
      leg: "Suba o mais alto que der e desça devagar, deixando o calcanhar passar do ponto inicial.",
      eq: [["espaldar", 166]], seta: "quad",
      A: p({ p: [100, 94], bd: [8, 6], ped: 0, pee: 0 }),
      B: p({ p: [100, 84], bd: [8, 6], pdT: [100, 130], peT: [100, 130], pd: null, pe: null, ped: -45, pee: -45 })
    },

    "Levantamento terra": {
      alt: "Levantamento terra: barra no chão, subindo até ficar em pé com o quadril estendido",
      leg: "Costas retas, barra rente às pernas. Quem levanta é o quadril e a perna, não a lombar.",
      seta: "mao", carga: "barra",
      A: { p: [92, 108], tr: 40, bd: [-90, -90], be: [-90, -90], pdT: [104, CH], peT: [104, CH], pdD: 1, peD: 1, ped: 0, pee: 0 },
      B: p({ p: [100, 94] })
    },

    /* =====================================================
       EMPURRAR
       ===================================================== */

    "Supino reto/inclinado": {
      alt: "Deitado no banco empurrando a barra do peito até os braços estendidos",
      leg: "Escápulas presas no banco, pés no chão. A barra desce à linha do peito e sobe em linha reta.",
      eq: [["banco", 92, 100, 78, 0]], seta: "mao", carga: "barra",
      A: { p: [80, 96], tr: 0, bd: [158, 40], be: [158, 40], pdT: [68, CH], peT: [68, CH], pdD: -1, peD: -1, ped: 180, pee: 180 },
      B: { p: [80, 96], tr: 0, bd: [92, 88], be: [92, 88], pdT: [68, CH], peT: [68, CH], pdD: -1, peD: -1, ped: 180, pee: 180 }
    },

    "Supino reto": {
      alt: "Deitado no banco empurrando a barra do peito até os braços estendidos",
      leg: "Escápulas presas no banco, pés no chão. A barra desce à linha do peito e sobe em linha reta.",
      eq: [["banco", 92, 100, 78, 0]], seta: "mao", carga: "barra",
      A: { p: [80, 96], tr: 0, bd: [158, 40], be: [158, 40], pdT: [68, CH], peT: [68, CH], pdD: -1, peD: -1, ped: 180, pee: 180 },
      B: { p: [80, 96], tr: 0, bd: [92, 88], be: [92, 88], pdT: [68, CH], peT: [68, CH], pdD: -1, peD: -1, ped: 180, pee: 180 }
    },

    "Desenvolvimento sentado com halteres": {
      alt: "Sentado no banco, empurrando os halteres da altura dos ombros até acima da cabeça",
      leg: "Costas apoiadas, costelas para baixo. Suba até os braços esticados sem arquear a lombar.",
      eq: [["banco", 100, 106, 40, 0]], seta: "mao", carga: "halter",
      A: { p: [100, 106], tr: 90, esc: 11, bd: [10, 100], be: [170, 80], pdT: [130, CH], peT: [130, CH], pdD: -1, peD: -1, ped: null, pee: null },
      B: { p: [100, 106], tr: 90, esc: 11, bd: [80, 92], be: [100, 88], pdT: [130, CH], peT: [130, CH], pdD: -1, peD: -1, ped: null, pee: null }
    },

    "Desenvolvimento militar": {
      alt: "Em pé, empurrando a barra da altura dos ombros até acima da cabeça",
      leg: "Glúteo e core travados. A barra sobe em linha reta e termina sobre o meio do pé.",
      seta: "mao", carga: "barra",
      A: p({ bd: [40, 120], be: [40, 120] }),
      B: p({ bd: [86, 92], be: [86, 92] })
    },

    "Flexão nas argolas (argolas baixas)": {
      alt: "Flexão de braço com as mãos nas argolas baixas, corpo em prancha",
      leg: "Corpo em linha reta do calcanhar à cabeça. As argolas balançam — o tronco não.",
      eq: [["argolas", 76, 30, 106]], seta: "nuca",
      A: { p: [112, 112], tr: 172, bdT: [76, 106], beT: [76, 106], bdD: 1, beD: 1, pdT: [158, 136], peT: [158, 136], pdD: -1, peD: -1, ped: -60, pee: -60 },
      B: { p: [112, 120], tr: 176, bdT: [76, 106], beT: [76, 106], bdD: 1, beD: 1, pdT: [158, 136], peT: [158, 136], pdD: -1, peD: -1, ped: -60, pee: -60 }
    },

    "Argola — support hold (falso apoio → apoio)": {
      alt: "Apoio nas argolas com os braços estendidos, corpo suspenso",
      leg: "Braços travados, argolas junto ao quadril e viradas para a frente. Ombros longe das orelhas.",
      eq: [["argolas", 100, 40, 92]], seta: "quad",
      A: { p: [100, 108], tr: 90, bdT: [80, 92], beT: [120, 92], bdD: -1, beD: 1, pdT: [104, CH], peT: [96, CH], ped: 0, pee: 0 },
      B: { p: [100, 96], tr: 90, bdT: [80, 92], beT: [120, 92], bdD: -1, beD: 1, pd: [-84, -88], pe: [-96, -92], ped: -20, pee: -20 }
    },

    "Argola — support hold": {
      alt: "Apoio nas argolas com os braços estendidos, corpo suspenso",
      leg: "Braços travados, argolas junto ao quadril e viradas para a frente. Ombros longe das orelhas.",
      eq: [["argolas", 100, 40, 92]], seta: "quad",
      A: { p: [100, 108], tr: 90, bdT: [80, 92], beT: [120, 92], bdD: -1, beD: 1, pdT: [104, CH], peT: [96, CH], ped: 0, pee: 0 },
      B: { p: [100, 96], tr: 90, bdT: [80, 92], beT: [120, 92], bdD: -1, beD: 1, pd: [-84, -88], pe: [-96, -92], ped: -20, pee: -20 }
    },

    "Elevação lateral leve": {
      alt: "Em pé de frente, subindo os halteres pelos lados até a altura dos ombros",
      leg: "Sobe só até a altura do ombro. Cotovelo levemente dobrado, sem impulso de tronco.",
      seta: "mao", carga: "halter",
      A: p({ esc: 11, bd: [-84, -88], be: [-96, -92] }),
      B: p({ esc: 11, bd: [-4, 4], be: [184, 176] })
    },

    "Tríceps": {
      alt: "Em pé com os cotovelos fixos, estendendo os antebraços para baixo",
      leg: "Cotovelos colados no corpo e parados. Só o antebraço se move.",
      seta: "mao", carga: "elastico", anc: [140, 12],
      A: p({ p: [84, 94], bd: [-100, 25], be: [-100, 25] }),
      B: p({ p: [84, 94], bd: [-100, -75], be: [-100, -75] })
    },

    /* =====================================================
       PUXAR
       ===================================================== */

    "Argola — remada horizontal": {
      alt: "Corpo inclinado segurando as argolas, puxando o peito até a altura das mãos",
      leg: "Corpo reto do calcanhar à cabeça. Puxe o peito até as mãos e aperte as escápulas.",
      eq: [["argolas", 88, 28, 74]], seta: "nuca",
      A: { p: [112, 116], tr: 162, bdT: [88, 74], beT: [88, 74], bdD: 1, beD: 1, pdT: [156, 138], peT: [156, 138], pdD: -1, peD: -1, ped: -55, pee: -55 },
      B: { p: [110, 108], tr: 166, bdT: [88, 74], beT: [88, 74], bdD: 1, beD: 1, pdT: [156, 138], peT: [156, 138], pdD: -1, peD: -1, ped: -55, pee: -55 }
    },

    "Remada nas argolas (corpo inclinado)": {
      alt: "Corpo inclinado segurando as argolas, puxando o peito até a altura das mãos",
      leg: "Quanto mais deitado, mais difícil. Puxe o peito até as mãos, escápulas para trás.",
      eq: [["argolas", 88, 28, 74]], seta: "nuca",
      A: { p: [112, 116], tr: 162, bdT: [88, 74], beT: [88, 74], bdD: 1, beD: 1, pdT: [156, 138], peT: [156, 138], pdD: -1, peD: -1, ped: -55, pee: -55 },
      B: { p: [110, 108], tr: 166, bdT: [88, 74], beT: [88, 74], bdD: 1, beD: 1, pdT: [156, 138], peT: [156, 138], pdD: -1, peD: -1, ped: -55, pee: -55 }
    },

    "Remada TRX": {
      alt: "Corpo inclinado segurando as fitas, puxando o peito até a altura das mãos",
      leg: "Corpo reto do calcanhar à cabeça. Quanto mais deitado, mais pesado.",
      eq: [["tiras", 88, 28, 74]], seta: "nuca",
      A: { p: [112, 116], tr: 162, bdT: [88, 74], beT: [88, 74], bdD: 1, beD: 1, pdT: [156, 138], peT: [156, 138], pdD: -1, peD: -1, ped: -55, pee: -55 },
      B: { p: [110, 108], tr: 166, bdT: [88, 74], beT: [88, 74], bdD: 1, beD: 1, pdT: [156, 138], peT: [156, 138], pdD: -1, peD: -1, ped: -55, pee: -55 }
    },

    "Remada curvada (pegada neutra ou pronada)": {
      alt: "Tronco inclinado à frente, puxando a barra até a altura do umbigo",
      leg: "Tronco quase paralelo ao chão e parado. A barra sobe até a barriga; escápulas para trás.",
      seta: "mao", carga: "barra",
      A: px(DOBRADO, { bd: [-90, -90], be: [-90, -90], pdT: [100, CH], peT: [100, CH], pd: null, pe: null }),
      B: px(DOBRADO, { bdT: [124, 104], beT: [124, 104], bdD: -1, beD: -1, pdT: [100, CH], peT: [100, CH], pd: null, pe: null })
    },

    "Remada curvada": {
      alt: "Tronco inclinado à frente, puxando a barra até a altura do umbigo",
      leg: "Tronco quase paralelo ao chão e parado. A barra sobe até a barriga; escápulas para trás.",
      seta: "mao", carga: "barra",
      A: px(DOBRADO, { bd: [-90, -90], be: [-90, -90], pdT: [100, CH], peT: [100, CH], pd: null, pe: null }),
      B: px(DOBRADO, { bdT: [124, 104], beT: [124, 104], bdD: -1, beD: -1, pdT: [100, CH], peT: [100, CH], pd: null, pe: null })
    },

    "Barra fixa / puxada assistida com elástico": {
      alt: "Pendurado na barra fixa, puxando o corpo até o queixo passar da barra",
      leg: "Comece dos braços estendidos. Puxe os cotovelos para baixo até o queixo passar da barra.",
      eq: [["barraFixa", 26]], seta: "cab",
      A: { p: [100, 96], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -80], pe: [-90, -80], ped: -30, pee: -30 },
      B: { p: [100, 72], tr: 90, bdT: [107, 26], beT: [99, 26], bdD: 1, beD: -1, pd: [-90, -60], pe: [-90, -60], ped: -30, pee: -30 }
    },

    "Face pull com elástico": {
      alt: "Puxando o elástico ancorado no alto até a altura do rosto, cotovelos abertos",
      leg: "Cotovelos altos e abertos. As mãos terminam ao lado do rosto, não à frente do peito.",
      seta: "mao", carga: "elastico", anc: [178, 52],
      A: p({ bd: [4, 2], be: [4, 2] }),
      B: p({ bd: [168, 26], be: [168, 26] })
    },

    "Face pull no TRX": {
      alt: "Corpo inclinado nas fitas, puxando até as mãos ficarem ao lado do rosto",
      leg: "Cotovelos altos e abertos, mãos terminando ao lado do rosto. Corpo reto.",
      eq: [["tiras", 86, 30, 66]], seta: "nuca",
      A: { p: [114, 116], tr: 160, bdT: [86, 68], beT: [86, 68], bdD: 1, beD: 1, pdT: [158, 138], peT: [158, 138], pdD: -1, peD: -1, ped: -55, pee: -55 },
      B: { p: [108, 108], tr: 164, bdT: [86, 62], beT: [86, 62], bdD: -1, beD: -1, pdT: [158, 138], peT: [158, 138], pdD: -1, peD: -1, ped: -55, pee: -55 }
    },

    "Rosca direta leve": {
      alt: "Em pé, dobrando os cotovelos para subir a carga até a altura dos ombros",
      leg: "Cotovelo parado ao lado do corpo. Sobe e desce sem balançar o tronco.",
      seta: "mao", carga: "halter",
      A: p({ esc: 10, bd: [-90, -88], be: [-90, -92] }),
      B: p({ esc: 10, bd: [-90, 62], be: [-90, 118] })
    },

    "Excêntrico de punho (extensor e flexor)": {
      alt: "Antebraço apoiado na coxa, só o punho subindo e descendo bem devagar",
      leg: "O antebraço fica apoiado e parado. A descida é a parte que importa: bem lenta.",
      seta: "mao", carga: "halter1",
      A: { p: [96, 110], tr: 76, bd: [-30, 16], be: [-40, -20], pdT: [122, CH], peT: [122, CH], pdD: 1, peD: 1, ped: 0, pee: 0 },
      B: { p: [96, 110], tr: 76, bd: [-30, -34], be: [-40, -20], pdT: [122, CH], peT: [122, CH], pdD: 1, peD: 1, ped: 0, pee: 0 }
    },

    /* =====================================================
       CORE
       ===================================================== */

    "Hollow body hold": {
      alt: "Deitado de costas com braços e pernas estendidos e a lombar colada no chão",
      leg: "Lombar colada no chão. Se ela descolar, suba um pouco os braços ou dobre os joelhos.",
      seta: null,
      A: { p: [100, 124], tr: 8, arco: 6, bd: [14, 10], be: [14, 10], pd: [184, 180], pe: [184, 180], ped: 140, pee: 140 },
      B: { p: [100, 127], tr: 6, arco: 4, bd: [8, 4], be: [8, 4], pd: [188, 185], pe: [188, 185], ped: 140, pee: 140 }
    },

    "Tuck hold nas argolas": {
      alt: "Suspenso nas argolas com os joelhos puxados até o peito",
      leg: "A partir do apoio firme, traga os joelhos ao peito e segure sem balançar.",
      eq: [["argolas", 100, 40, 92]], seta: "joelho",
      A: { p: [100, 96], tr: 90, bdT: [80, 92], beT: [120, 92], bdD: -1, beD: 1, pd: [-84, -88], pe: [-96, -92], ped: -20, pee: -20 },
      B: { p: [100, 96], tr: 90, bdT: [80, 92], beT: [120, 92], bdD: -1, beD: 1, pd: [-6, 190], pe: [-14, 186], ped: null, pee: null }
    },

    "Prancha": {
      alt: "Prancha nos antebraços, corpo em linha reta do calcanhar à cabeça",
      leg: "Linha reta do calcanhar à cabeça. Glúteo apertado, quadril nem sobe nem cai.",
      seta: null,
      A: { p: [112, 118], tr: 169, bdT: [91, CH], bdD: -1, beT: [91, CH], beD: -1, pdT: [158, 138], peT: [158, 138], pdD: -1, peD: -1, ped: -60, pee: -60 },
      B: { p: [112, 121], tr: 172, bdT: [91, CH], bdD: -1, beT: [91, CH], beD: -1, pdT: [158, 138], peT: [158, 138], pdD: -1, peD: -1, ped: -60, pee: -60 }
    },

    "Core: prancha + rotação de tronco": {
      alt: "Da prancha, girando o tronco e abrindo um braço para cima",
      leg: "Gire a partir do tronco, empilhando os ombros. O quadril acompanha sem cair.",
      seta: "mao",
      A: { p: [112, 118], tr: 169, bdT: [91, CH], bdD: -1, beT: [91, CH], beD: -1, pdT: [158, 138], peT: [158, 138], pdD: -1, peD: -1, ped: -60, pee: -60 },
      B: { p: [112, 118], tr: 169, bd: [72, 84], beT: [91, CH], beD: -1, pdT: [158, 138], peT: [158, 138], pdD: -1, peD: -1, ped: -60, pee: -60 }
    },

    /* =====================================================
       LUTA / TECIDO / CIRCUITO
       ===================================================== */

    "Speedball (pera)": {
      alt: "Em guarda golpeando a pera, alternando as mãos",
      leg: "Cotovelos altos, golpes curtos e no ritmo. O pé quase não sai do lugar.",
      eq: [["pera", 150]], seta: "mao",
      A: p({ p: [98, 94], pdT: [110, CH], peT: [86, CH], pd: null, pe: null, bd: [10, 40], be: [26, 60] }),
      B: p({ p: [98, 94], pdT: [110, CH], peT: [86, CH], pd: null, pe: null, bd: [26, 60], be: [10, 40] })
    },

    "Saco de pancada": {
      alt: "Em guarda de boxe golpeando o saco de pancada",
      leg: "Guarda alta entre um golpe e outro. O soco sai do chão, girando o pé de trás.",
      eq: [["saco", 156]], seta: "mao",
      A: p({ p: [96, 94], pdT: [110, CH], peT: [82, CH], pd: null, pe: null, bd: [-20, 62], be: [-30, 70] }),
      B: p({ p: [98, 94], pdT: [112, CH], peT: [84, CH], pd: null, pe: null, bd: [-2, 4], be: [-30, 70] })
    },

    "Tecido — subidas (russa ou francesa)": {
      alt: "Subindo pelo tecido, mãos acima e pés travando o tecido embaixo",
      leg: "Trave o pé primeiro, depois suba as mãos. A perna sustenta mais que o braço.",
      eq: [["tecido", 100, 22]], seta: "quad",
      A: { p: [100, 110], tr: 90, bdT: [100, 56], beT: [100, 56], bdD: 1, beD: -1, pd: [-40, -110], pe: [-140, -70], ped: null, pee: null },
      B: { p: [100, 86], tr: 90, bdT: [100, 34], beT: [100, 34], bdD: 1, beD: -1, pd: [-70, -90], pe: [-110, -90], ped: null, pee: null }
    },

    "Tecido — footlock simples + figura básica": {
      alt: "Suspenso no tecido com o pé travado, montando uma figura simples",
      leg: "Confira o footlock antes de tirar o peso do chão. Figura só depois que a trava está firme.",
      eq: [["tecido", 100, 26]], seta: "pe",
      A: { p: [100, 104], tr: 90, bdT: [100, 52], beT: [100, 52], bdD: 1, beD: -1, pd: [-88, -90], pe: [-92, -90], ped: null, pee: null },
      B: { p: [100, 100], tr: 90, bdT: [100, 48], beT: [100, 48], bdD: 1, beD: -1, pd: [-30, -96], pe: [-96, -92], ped: null, pee: null }
    },

    "Tecido — invertida com apoio (crucifixo/casulo)": {
      alt: "Invertido no tecido, cabeça para baixo, com apoio",
      leg: "Inverta só com o apoio conferido. Desça pelo mesmo caminho que subiu.",
      eq: [["tecido", 100, 26]], seta: "cab",
      A: { p: [100, 100], tr: 90, bdT: [104, 50], beT: [96, 50], bdD: 1, beD: -1, pd: [-88, -90], pe: [-92, -90], ped: null, pee: null },
      B: { p: [116, 62], tr: -90, bdT: [112, 88], beT: [104, 88], bdD: -1, beD: 1, pd: [86, 88], pe: [94, 92], ped: null, pee: null }
    },

    "Circuito funcional (3 voltas, 40s/20s)": {
      alt: "Circuito: do agachamento para a extensão completa, em ritmo contínuo",
      leg: "40 segundos de trabalho, 20 de pausa, sem parar entre as estações. Técnica antes de velocidade.",
      seta: "quad",
      A: px(AGACHADO, { bd: [-40, 20], be: [-40, 20] }),
      B: p({ p: [100, 88], bd: [86, 92], be: [94, 88], pdT: [100, 134], peT: [100, 134], pd: null, pe: null, ped: -30, pee: -30 })
    }
  };

  global.FIGURAS_DEF = D;
})(typeof window !== "undefined" ? window : this);
