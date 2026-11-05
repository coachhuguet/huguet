// Coach Huguet · dibuixos animats dels exercicis (comú per a tots els clients).
// A cada exercici del planning: <div class="ex" data-fig="clau"> i aquí es dibuixa el ninot que es mou
// entre la posició inicial (a) i la final (b), passant per (m) si n'hi ha.
// Claus disponibles: mira la llista F de sota (bench, squat, pushup, plank...).
(function () {
  var L = { t: 32, h: 9, u: 17, f: 16, th: 21, sh: 21 };
  var G = 104;
  var F = {
    // ── Pit ──
    bench: { a: { P: [94, 70], t: 180, E: [57, 80], W: [61, 63], F: [114, 104], kb: -1 }, b: { E: [62, 56], W: [62, 40] },
      props: [['l', 36, 74, 108, 74, 'gr'], ['l', 44, 74, 44, 104, 'gr'], ['l', 100, 74, 100, 104, 'gr'], ['l', 74, -8, 74, 104, 'gr'], ['o', 'W', 7]] },
    benchbar: { a: { P: [94, 70], t: 180, E: [57, 80], W: [61, 63], F: [114, 104], kb: -1 }, b: { E: [62, 56], W: [62, 40] },
      props: [['l', 36, 74, 108, 74, 'gr'], ['l', 44, 74, 44, 104, 'gr'], ['l', 100, 74, 100, 104, 'gr'], ['o', 'W', 7]] },
    dbbench: { a: { P: [94, 70], t: 180, E: [57, 80], W: [61, 63], F: [114, 104], kb: -1 }, b: { E: [62, 56], W: [62, 40] },
      props: [['l', 36, 74, 108, 74, 'gr'], ['l', 44, 74, 44, 104, 'gr'], ['l', 100, 74, 100, 104, 'gr'], ['d', 'W']] },
    incline: { a: { P: [96, 78], t: -150, E: [65, 72], W: [70, 55], F: [120, 104], kb: -1 }, b: { E: [68, 46], W: [68, 30] },
      props: [['l', 98, 82, 62, 61, 'gr'], ['l', 98, 82, 120, 82, 'gr'], ['l', 100, 82, 100, 104, 'gr'], ['d', 'W']] },
    chestpress: { a: { P: [70, 82], t: -90, E: [58, 56], W: [74, 50], F: [94, 104], kb: -1 }, b: { E: [86, 51], W: [102, 50] },
      props: [['l', 65, 86, 65, 42, 'gr'], ['l', 63, 86, 90, 86, 'gr'], ['l', 76, 86, 76, 104, 'gr'], ['m', 122, 6, 'W'], ['o', 'W', 3]] },
    fly: { front: 1, a: { P: [80, 62], t: -90, W: [46, 36], W2: [114, 36], eb: 1, F: [74, 104], F2: [86, 104] }, b: { W: [76, 44], W2: [84, 44] },
      props: [['c', 14, -8, 'W'], ['c', 146, -8, 'W2'], ['o', 'W', 3], ['o', 'W2', 3]] },
    dips: { a: { P: [80, 60], t: -86, W: [84, 60], eb: -1, th: 110, sa: 165 }, b: { P: [76, 74], t: -78 },
      props: [['l', 70, 60, 104, 60, 'eq'], ['l', 100, 60, 100, 104, 'gr']] },
    pushup: { a: { P: [89, 84.6], t: -155, W: [60, 103], eb: -1, F: [128, 103], kb: 1, T: [132, 104] }, b: { P: [87, 96.8], t: -171 },
      props: [] },

    // ── Espatlla ──
    military: { a: { P: [80, 80], t: -90, E: [84, 58], W: [83, 42], F: [102, 104], kb: -1 }, b: { E: [81, 33], W: [80, 17] },
      props: [['l', 75, 84, 75, 42, 'gr'], ['l', 73, 84, 100, 84, 'gr'], ['l', 88, 84, 88, 104, 'gr'], ['d', 'W']] },
    // Vist de davant: manuelles a l'alçada de les espatlles i braços estirats amunt.
    ohp: { front: 1, a: { P: [80, 62], t: -90, ua: 180, fa: -90, ua2: 0, fa2: -90, F: [74, 104], F2: [86, 104] }, b: { ua: 258, fa: 265, ua2: -78, fa2: -85 },
      props: [['d', 'W'], ['d', 'W2']] },
    lateral: { front: 1, a: { P: [80, 62], t: -90, ua: 100, fa: 100, ua2: 80, fa2: 80, F: [74, 104], F2: [86, 104] }, b: { ua: 180, fa: 172, ua2: 0, fa2: 8 },
      props: [['d', 'W'], ['d', 'W2']] },
    facepull: { a: { P: [70, 63], t: -96, W: [100, 31], eb: -1, F: [72, 104], kb: -1 }, b: { W: [76, 22] },
      props: [['c', 134, 28, 'W'], ['o', 'W', 3]] },
    extrot: { front: 1, a: { P: [80, 62], t: -90, E: [70, 48], W: [80, 52], ua2: 92, fa2: 92, F: [74, 104], F2: [86, 104] }, b: { W: [56, 47] },
      props: [['c', 146, 50, 'W'], ['o', 'W', 3]] },
    landmine: { a: { P: [80, 64], t: -90, W: [88, 36], eb: 1, F: [94, 104], F2: [64, 104], kb: -1 }, b: { t: -80, W: [110, 12] },
      props: [['m', 18, 103, 'W'], ['o', 'W', 4]] },

    // ── Tríceps ──
    pushdown: { a: { P: [76, 63], t: -82, ua: 88, fa: -15, F: [76, 104], kb: -1 }, b: { fa: 85 },
      props: [['c', 100, -6, 'W'], ['o', 'W', 3]] },
    overhead: { a: { P: [78, 63], t: -90, ua: -100, fa: 115, F: [78, 104], kb: -1 }, b: { fa: 265 },
      props: [['d', 'W']] },
    skull: { a: { P: [94, 70], t: 180, ua: -100, fa: 150, F: [114, 104], kb: -1 }, b: { fa: 265 },
      props: [['l', 36, 74, 108, 74, 'gr'], ['l', 44, 74, 44, 104, 'gr'], ['l', 100, 74, 100, 104, 'gr'], ['o', 'W', 5]] },

    // ── Esquena ──
    lat: { a: { P: [74, 84], t: -96, W: [74, 20], eb: 1, F: [98, 104], kb: -1 }, b: { t: -104, W: [75, 54] },
      props: [['l', 60, 88, 90, 88, 'gr'], ['l', 76, 88, 76, 104, 'gr'], ['l', 88, 76, 100, 76, 'gr'], ['c', 74, -10, 'W'], ['o', 'W', 3]] },
    pullup: { a: { P: [80, 70], t: -90, W: [82, 4], eb: 1, th: 100, sa: 160 }, b: { P: [80, 48] },
      props: [['l', 58, 4, 104, 4, 'eq'], ['l', 58, -10, 58, 104, 'gr']] },
    rings: { a: { P: [80, 70], t: -90, W: [82, 4], eb: 1, th: 100, sa: 160 }, b: { P: [80, 48] },
      props: [['c', 82, -12, 'W'], ['o', 'W', 4]] },
    row: { a: { P: [58, 86], t: -62, W: [96, 74], eb: 1, F: [86, 104], kb: -1 }, b: { W: [76, 74] },
      props: [['l', 66, 88, 80, 62, 'gr'], ['l', 74, 76, 74, 104, 'gr'], ['l', 44, 90, 66, 90, 'gr'], ['o', 'W', 3]] },
    bbrow: { a: { P: [72, 62], t: -25, W: [103, 82], eb: 1, F: [82, 104], kb: -1 }, b: { W: [94, 64] },
      props: [['o', 'W', 6]] },
    dbrow: { a: { P: [62, 63], t: -4, W: [96, 94], eb: 1, W2: [100, 83], th: 90, sa: 180, F2: [76, 103], kb: -1 }, b: { W: [84, 72] },
      props: [['l', 36, 84, 108, 84, 'gr'], ['l', 46, 84, 46, 104, 'gr'], ['l', 100, 84, 100, 104, 'gr'], ['d', 'W']] },
    cablerow: { a: { P: [62, 86], t: -72, W: [100, 70], eb: 1, F: [104, 92], kb: -1 }, b: { t: -94, W: [76, 70] },
      props: [['l', 44, 90, 80, 90, 'gr'], ['l', 60, 90, 60, 104, 'gr'], ['l', 108, 84, 108, 104, 'gr'], ['c', 136, 88, 'W'], ['o', 'W', 3]] },
    bandrow: { a: { P: [60, 98], t: -84, W: [96, 74], eb: -1, F: [102, 100], kb: -1 }, b: { t: -96, W: [74, 74] },
      props: [['c', 104, 97, 'W']] },
    invrow: { a: { P: [70, 90], t: -20, W: [102, 44], eb: 1, F: [30, 103], kb: 1 }, b: { P: [64, 80], t: -36 },
      props: [['c', 102, -12, 'W'], ['o', 'W', 4]] },
    pullover: { a: { P: [70, 64], t: -62, ua: -40, fa: -35, F: [72, 104], kb: -1 }, b: { ua: 95, fa: 92 },
      props: [['c', 132, -6, 'W'], ['o', 'W', 3]] },

    // ── Bíceps i avantbraç ──
    curlbar: { a: { P: [78, 63], t: -90, ua: 92, fa: 88, F: [78, 104], kb: -1 }, b: { fa: -55 },
      props: [['o', 'W', 5]] },
    curldb: { a: { P: [78, 63], t: -90, ua: 92, fa: 88, F: [78, 104], kb: -1 }, b: { fa: -55 },
      props: [['d', 'W']] },
    cablecurl: { a: { P: [78, 63], t: -90, ua: 92, fa: 88, F: [78, 104], kb: -1 }, b: { fa: -55 },
      props: [['c', 100, 104, 'W'], ['o', 'W', 3]] },
    inclinecurl: { a: { P: [80, 82], t: -118, ua: 98, fa: 96, th: 0, sa: 90 }, b: { fa: -30 },
      props: [['l', 86, 86, 62, 44, 'gr'], ['l', 74, 86, 106, 86, 'gr'], ['l', 92, 86, 92, 104, 'gr'], ['d', 'W']] },
    wrist: { a: { P: [70, 82], t: -62, E: [90, 70], W: [105, 76], th: 0, sa: 90 }, b: { W: [105, 64] },
      props: [['l', 54, 86, 96, 86, 'gr'], ['l', 74, 86, 74, 104, 'gr'], ['d', 'W']] },

    // ── Cama ──
    squat: { a: { P: [86, 63], t: -88, Wr: [-3, 3], eb: -1, F: [88, 104], kb: -1 }, b: { P: [66, 84], t: -58 },
      props: [['l', 100, -8, 100, 104, 'gr'], ['o', 'N', 6]] },
    bbsquat: { a: { P: [86, 63], t: -88, Wr: [-3, 3], eb: -1, F: [88, 104], kb: -1 }, b: { P: [66, 84], t: -58 },
      props: [['o', 'N', 6]] },
    goblet: { a: { P: [84, 63], t: -88, Wr: [9, 8], eb: -1, F: [88, 104], kb: -1 }, b: { P: [70, 86], t: -66 },
      props: [['o', 'W', 5]] },
    jumpsquat: { a: { P: [66, 84], t: -58, Wr: [-3, 3], eb: -1, F: [88, 104], kb: -1 }, b: { P: [86, 52], t: -88, F: [88, 93] },
      props: [['l', 100, -8, 100, 104, 'gr'], ['o', 'N', 6]] },
    legpress: { a: { P: [56, 84], t: -155, W: [52, 92], eb: 1, F: [76, 64], kb: -1 }, b: { F: [84, 56] },
      props: [['l', 60, 89, 26, 74, 'gr'], ['l', 72, 76, 112, 36, 'gr'], ['p', 'F', 8, 8]] },
    legcurl: { a: { P: [70, 80], t: -100, W: [80, 84], eb: 1, th: 0, sa: 15 }, b: { sa: 115 },
      props: [['l', 60, 85, 92, 85, 'gr'], ['l', 62, 85, 57, 46, 'gr'], ['l', 76, 85, 76, 104, 'gr'], ['l', 84, 74, 98, 74, 'gr'], ['o', 'F', 4]] },
    legext: { a: { P: [70, 80], t: -95, W: [80, 84], eb: 1, th: -5, sa: 100 }, b: { sa: 0 },
      props: [['l', 60, 85, 92, 85, 'gr'], ['l', 62, 85, 59, 46, 'gr'], ['l', 76, 85, 76, 104, 'gr'], ['o', 'F', 4]] },
    rdl: { a: { P: [80, 63], t: -90, Wr: [2, 31], eb: 1, F: [82, 104], kb: -1 }, b: { P: [70, 64], t: -18 },
      props: [['o', 'W', 6]] },
    rdldb: { a: { P: [80, 63], t: -90, Wr: [2, 31], eb: 1, F: [82, 104], kb: -1 }, b: { P: [70, 64], t: -18 },
      props: [['d', 'W']] },
    bulgarian: { a: { P: [82, 63], t: -88, Wr: [1, 31], eb: 1, F: [100, 104], F2: [52, 82], kb: -1 }, b: { P: [78, 80], t: -84 },
      props: [['l', 34, 84, 62, 84, 'gr'], ['l', 48, 84, 48, 104, 'gr'], ['d', 'W']] },
    bulgarsmith: { a: { P: [82, 63], t: -88, Wr: [-3, 3], eb: -1, F: [100, 104], F2: [52, 82], kb: -1 }, b: { P: [78, 80], t: -84 },
      props: [['l', 34, 84, 62, 84, 'gr'], ['l', 48, 84, 48, 104, 'gr'], ['l', 96, -8, 96, 104, 'gr'], ['o', 'N', 6]] },
    lunge: { a: { P: [88, 63], t: -90, Wr: [1, 31], eb: 1, F: [92, 104], F2: [86, 104], kb: -1 }, b: { P: [76, 80], F2: [48, 103] },
      props: [['d', 'W']] },
    // Gambada endavant: el peu del darrere es queda i el del davant fa el pas.
    lungefwd: { a: { P: [80, 63], t: -90, Wr: [1, 31], eb: 1, F: [82, 104], F2: [78, 104], kb: -1 }, b: { P: [96, 82], F: [120, 104], F2: [64, 103] },
      props: [['d', 'W']] },
    lateralsquat: { front: 1, a: { P: [80, 66], t: -90, W: [77, 42], W2: [83, 42], eb: 1, F: [58, 104], F2: [102, 104] }, b: { P: [64, 82], W: [61, 58], W2: [67, 58] },
      props: [['m', 150, 103, 'W'], ['o', 'W', 4]] },
    stepup: { a: { P: [74, 64], t: -88, Wr: [1, 31], eb: 1, F: [96, 82], F2: [72, 104], kb: -1 }, b: { P: [94, 44], F2: [100, 66] },
      props: [['l', 84, 84, 128, 84, 'gr'], ['l', 84, 84, 84, 104, 'gr'], ['l', 128, 84, 128, 104, 'gr'], ['d', 'W']] },
    nordic: { a: { Kp: [72, 102], th: 90, sa: 180, t: -90, Wr: [10, 14], eb: -1 }, b: { th: 20, t: -20, Wr: [16, 18] },
      props: [['o', 'F', 3], ['l', 40, 104, 80, 104, 'eq']] },
    bridge: { a: { P: [84, 98], t: 180, W: [84, 103], eb: 1, F: [112, 103], kb: -1 }, b: { P: [86, 78], t: 150 },
      props: [] },
    calves: { a: { P: [78, 60], t: -90, W: [80, 62], eb: 1, F: [78, 101], T: [89, 104], kb: -1 }, b: { P: [80, 53], W: [82, 55], F: [80, 94] },
      props: [['l', 84, 104, 120, 104, 'eq']] },
    seatedcalf: { a: { P: [68, 82], t: -88, W: [88, 78], eb: 1, F: [94, 100], T: [104, 102], kb: -1 }, b: { F: [94, 94] },
      props: [['l', 50, 86, 80, 86, 'gr'], ['l', 64, 86, 64, 104, 'gr'], ['l', 80, 74, 100, 74, 'eq'], ['l', 98, 104, 116, 104, 'eq']] },

    // ── Core ──
    plank: { a: { P: [92, 86], t: 180, E: [60, 103], W: [44, 103], F: [132, 102], kb: 1, T: [135, 104] }, b: { P: [92, 85] },
      props: [] },
    sideplank: { front: 1, a: { P: [88, 94], t: -152.7, E: [56, 103], W: [44, 103], F: [131, 101], F2: [131, 97] }, b: { P: [88, 87], t: -163.8 },
      props: [] },
    copenhagen: { front: 1, a: { P: [88, 96], t: -149.9, E: [56, 103], W: [44, 103], F: [122, 100], F2: [128, 79] }, b: { P: [88, 82], t: -172.6, F: [122, 86] },
      props: [['l', 112, 82, 144, 82, 'gr'], ['l', 138, 82, 138, 104, 'gr']] },
    deadbug: { a: { P: [96, 96], t: 180, W: [64, 63], eb: 1, W2: [64, 63], th: -90, sa: 0, F2: [117, 74] }, b: { W2: [34, 92], F2: [136, 92] },
      props: [] },
    rollout: { a: { Kp: [72, 102], th: 90, sa: 180, t: -42, W: [98, 98], eb: 1 }, b: { th: 150, t: -10, W: [146, 98] },
      props: [['o', 'W', 5]] },
    superman: { a: { P: [90, 98], t: 180, W: [26, 98], eb: 1, F: [132, 101], kb: 1 }, b: { t: 194, W: [28, 82], F: [130, 88] },
      props: [] },
    pallof: { a: { P: [80, 66], t: -88, W: [92, 46], eb: 1, F: [86, 104], kb: -1 }, b: { W: [112, 44] },
      props: [['c', 150, 46, 'W'], ['o', 'W', 3]] },
    woodchop: { front: 1, a: { P: [80, 64], t: -90, W: [104, 8], W2: [100, 10], eb: 1, F: [66, 104], F2: [94, 104] }, b: { W: [60, 66], W2: [64, 64] },
      props: [['c', 146, -10, 'W'], ['o', 'W', 3]] },

    // ── Potència i pista ──
    boxjump: { a: { P: [52, 80], t: -48, W: [42, 74], eb: 1, F: [60, 104], kb: -1 }, m: { P: [86, 36], t: -84, W: [96, 4], F: [90, 72] }, b: { P: [106, 58], t: -66, W: [124, 44], F: [112, 82] },
      props: [['l', 96, 84, 140, 84, 'gr'], ['l', 96, 84, 96, 104, 'gr'], ['l', 140, 84, 140, 104, 'gr']] },
    slam: { a: { P: [80, 63], t: -90, W: [82, -2], eb: 1, F: [86, 104], kb: -1 }, b: { P: [72, 74], t: -38, W: [106, 98] },
      props: [['o', 'W', 6]] },
    rotthrow: { front: 1, a: { P: [80, 66], t: -90, W: [62, 62], W2: [66, 60], eb: 1, F: [64, 104], F2: [96, 104] }, b: { W: [106, 28], W2: [102, 30] },
      props: [['o', 'W', 6], ['l', 140, -8, 140, 104, 'gr']] },
    chestpass: { a: { P: [78, 64], t: -88, W: [92, 40], eb: 1, F: [92, 104], F2: [64, 104], kb: -1 }, b: { t: -80, W: [116, 36] },
      props: [['o', 'W', 6]] },
    lateralhop: { front: 1, a: { P: [58, 66], t: -90, ua: 125, fa: 110, ua2: 55, fa2: 70, F: [56, 104], F2: [70, 92] }, m: { P: [80, 52], F: [78, 92], F2: [92, 80] }, b: { P: [102, 66], F: [100, 104], F2: [114, 92] },
      props: [['l', 76, 104, 84, 104, 'eq']] },
    splitstep: { front: 1, a: { P: [80, 62], t: -90, ua: 115, fa: 60, ua2: 65, fa2: 120, F: [76, 104], F2: [84, 104] }, m: { P: [80, 54], F: [74, 96], F2: [86, 96] }, b: { P: [80, 72], F: [62, 104], F2: [98, 104] },
      props: [] },
    run: { a: { P: [80, 60], t: -78, W: [98, 44], W2: [64, 62], eb: 1, F: [104, 92], F2: [56, 100], kb: -1 }, b: { W: [64, 62], W2: [98, 44], F: [56, 100], F2: [104, 92] },
      props: [] },
    walk: { a: { P: [80, 62], t: -88, W: [92, 62], W2: [70, 62], eb: 1, F: [96, 104], F2: [64, 104], kb: -1 }, b: { W: [70, 62], W2: [92, 62], F: [64, 104], F2: [96, 104] },
      props: [] },
    farmer: { a: { P: [80, 62], t: -90, W: [83, 63], W2: [77, 63], eb: 1, F: [94, 104], F2: [66, 104], kb: -1 }, b: { F: [66, 104], F2: [94, 104] },
      props: [['d', 'W'], ['d', 'W2']] }
  };

  function rad(a) { return a * Math.PI / 180; }
  function ik(o, tg, l1, l2, s) {
    var dx = tg[0] - o[0], dy = tg[1] - o[1], d = Math.min(Math.hypot(dx, dy), l1 + l2 - .01), b = Math.atan2(dy, dx);
    d = Math.max(d, Math.abs(l1 - l2) + .01);
    var a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)), j = [o[0] + l1 * Math.cos(b + s * a), o[1] + l1 * Math.sin(b + s * a)];
    return [j, [j[0] + l2 * Math.cos(Math.atan2(tg[1] - j[1], tg[0] - j[0])), j[1] + l2 * Math.sin(Math.atan2(tg[1] - j[1], tg[0] - j[0]))]];
  }
  function mix(a, b, k) {
    var r = {};
    for (var key in a) {
      var v = a[key], w = key in b ? b[key] : v;
      r[key] = Array.isArray(v) ? [v[0] + (w[0] - v[0]) * k, v[1] + (w[1] - v[1]) * k] : (typeof v === 'number' ? v + (w - v) * k : v);
    }
    return r;
  }
  function fk(o, a1, a2, l1, l2) { var j = [o[0] + l1 * Math.cos(rad(a1)), o[1] + l1 * Math.sin(rad(a1))]; return [j, [j[0] + l2 * Math.cos(rad(a2)), j[1] + l2 * Math.sin(rad(a2))]]; }
  function solve(def, p) {
    var g = {}, t = rad(p.t);
    // Kp: genoll fix a terra (agenollat); el maluc surt de l'angle de la cuixa.
    var P = p.Kp ? [p.Kp[0] - L.th * Math.cos(rad(p.th)), p.Kp[1] - L.th * Math.sin(rad(p.th))] : p.P;
    var dir = [Math.cos(t), Math.sin(t)], per = [-dir[1], dir[0]];
    g.P = P; g.N = [P[0] + L.t * dir[0], P[1] + L.t * dir[1]]; g.H = [g.N[0] + L.h * dir[0], g.N[1] + L.h * dir[1]];
    var segs = [['P', 'N']], sh1 = g.N, sh2 = g.N, hp1 = P, hp2 = P;
    if (def.front) {
      // Vist de davant: espatlles i malucs separats (també si el cos està de costat a terra).
      g.S1 = sh1 = [g.N[0] - 9 * per[0] - 2 * dir[0], g.N[1] - 9 * per[1] - 2 * dir[1]];
      g.S2 = sh2 = [g.N[0] + 9 * per[0] - 2 * dir[0], g.N[1] + 9 * per[1] - 2 * dir[1]];
      g.Q1 = hp1 = [P[0] - 5 * per[0], P[1] - 5 * per[1]]; g.Q2 = hp2 = [P[0] + 5 * per[0], P[1] + 5 * per[1]];
      segs.push(['S1', 'S2'], ['Q1', 'Q2']);
    }
    var W = p.Wr ? [g.N[0] + p.Wr[0], g.N[1] + p.Wr[1]] : p.W;
    var lu = def.u || L.u, lf = def.f || L.f;
    var a = p.E ? [p.E, p.W] : p.ua != null ? fk(sh1, p.ua, p.fa, lu, lf) : ik(sh1, W, lu, lf, p.eb); g.E = a[0]; g.W = a[1];
    segs.push([def.front ? 'S1' : 'N', 'E'], ['E', 'W']);
    if (p.ua2 != null || p.W2) { a = p.ua2 != null ? fk(sh2, p.ua2, p.fa2, lu, lf) : ik(sh2, p.W2, lu, lf, def.front ? -p.eb : p.eb); g.E2 = a[0]; g.W2 = a[1]; segs.push([def.front ? 'S2' : 'N', 'E2'], ['E2', 'W2']); }
    var k = p.Kp ? [p.Kp, [p.Kp[0] + L.sh * Math.cos(rad(p.sa)), p.Kp[1] + L.sh * Math.sin(rad(p.sa))]]
      : p.th != null ? fk(hp1, p.th, p.sa, L.th, L.sh) : ik(hp1, p.F, L.th, L.sh, def.front ? 1 : p.kb);
    g.K = k[0]; g.F = k[1];
    segs.push([def.front ? 'Q1' : 'P', 'K'], ['K', 'F']);
    if (p.F2) { k = ik(hp2, p.F2, L.th, L.sh, def.front ? -1 : (p.kb || -1)); g.K2 = k[0]; g.F2 = k[1]; segs.push([def.front ? 'Q2' : 'P', 'K2'], ['K2', 'F2']); }
    if (p.T) { g.T = p.T; segs.push(['F', 'T']); }
    return { g: g, segs: segs };
  }
  function shapes(def, s) {
    var g = s.g, out = [];
    s.segs.forEach(function (q) { out.push({ e: 'line', c: '', v: [g[q[0]][0], g[q[0]][1], g[q[1]][0], g[q[1]][1]] }); });
    out.push({ e: 'circle', c: 'hd', r: 6, v: [g.H[0], g.H[1]] });
    def.props.forEach(function (pr) {
      if (pr[0] === 'l') out.push({ e: 'line', c: pr[5], v: pr.slice(1, 5) });
      else if (pr[0] === 'o') out.push({ e: 'circle', c: 'eqc', r: pr[2], v: [g[pr[1]][0], g[pr[1]][1]] });
      else if (pr[0] === 'd') { var w = g[pr[1]]; out.push({ e: 'line', c: 'db', v: [w[0] - 5, w[1], w[0] + 5, w[1]] }); }
      else if (pr[0] === 'c') out.push({ e: 'line', c: 'cab', v: [pr[1], pr[2], g[pr[3]][0], g[pr[3]][1]] }, { e: 'circle', c: 'eqc', r: 3, v: [pr[1], pr[2]] });
      else if (pr[0] === 'm') out.push({ e: 'line', c: 'eq', v: [pr[1], pr[2], g[pr[3]][0], g[pr[3]][1]] });
      else if (pr[0] === 'p') { var f = g[pr[1]]; out.push({ e: 'line', c: 'eq', v: [f[0] - pr[2], f[1] - pr[3], f[0] + pr[2], f[1] + pr[3]] }); }
    });
    return out;
  }
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var attrs = { line: ['x1', 'y1', 'x2', 'y2'], circle: ['cx', 'cy'] }, cache = {}, N = 24;
  function framesOf(key) {
    if (cache[key]) return cache[key];
    var def = F[key], A = def.a, B = mix(A, def.b, 1), M = def.m ? mix(A, def.m, 1) : null, fr = [];
    for (var i = 0; i <= N; i++) {
      var k = i / N, p = !M ? mix(A, B, k) : k < .5 ? mix(A, M, k * 2) : mix(M, B, k * 2 - 1);
      fr.push(shapes(def, solve(def, p)));
    }
    return (cache[key] = fr);
  }
  function el(sh, extra) {
    var a = attrs[sh.e].map(function (at, i) { return at + '="' + sh.v[i].toFixed(1) + '"'; }).join(' ');
    return '<' + sh.e + ' class="' + (sh.c + extra).trim() + '" ' + a + (sh.r ? ' r="' + sh.r + '"' : '') + '/>';
  }
  var label = document.documentElement.lang === 'es' ? 'Dibujo del ejercicio' : 'Dibuix de l\'exercici';
  function svg(key) {
    if (!F[key]) return '';
    var fr = framesOf(key), html = '<svg class="fig" data-k="' + key + '" viewBox="0 -12 160 122" role="img" aria-label="' + label + '"><line class="gr" x1="6" y1="' + G + '" x2="154" y2="' + G + '"/>';
    if (still) fr[0].forEach(function (sh) { html += el(sh, ' far'); });
    (still ? fr[N] : fr[0]).forEach(function (sh) { html += el(sh, ''); });
    return html + '</svg>';
  }
  // Moviment: anada i tornada suau cada 3,2 s, només als dibuixos visibles.
  if (!still) (function tick(now) {
    var u = (now % 3200) / 1600, k = (1 - Math.cos(Math.PI * (u > 1 ? 2 - u : u))) / 2, x = k * N, i = Math.min(Math.floor(x), N - 1), w = x - i;
    document.querySelectorAll('svg.fig[data-k]').forEach(function (s) {
      if (!s.getClientRects().length) return;
      var fr = framesOf(s.dataset.k), kids = s.children;
      fr[i].forEach(function (sh, si) {
        var n2 = fr[i + 1][si], node = kids[si + 1];
        attrs[sh.e].forEach(function (at, ai) { node.setAttribute(at, (sh.v[ai] + (n2.v[ai] - sh.v[ai]) * w).toFixed(1)); });
      });
    });
    requestAnimationFrame(tick);
  })(0);
  document.querySelectorAll('.ex[data-fig]').forEach(function (ex) {
    var why = ex.querySelector('.why');
    var html = svg(ex.dataset.fig);
    if (!html) return;
    if (why) why.insertAdjacentHTML('afterend', html); else ex.insertAdjacentHTML('beforeend', html);
  });
  window.coachNinots = { keys: Object.keys(F), svg: svg, frames: framesOf };
})();
