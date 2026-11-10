# Coach Huguet · com treballar en aquest repo

Cada client té un HTML senzill (`<client>.html`), publicat a `https://coachhuguet.github.io/huguet/<client>.html`.
Els canvis es pugen directament a `main`.

## Disseny comú (el del Jowni)

Tot el que és igual per a tots els clients viu a `comu/` i cada HTML només té el seu contingut:

- `comu/coach.css` · l'estil (verd i blau sobre fons fosc).
- `comu/ninots.js` · els ninots animats. A cada exercici: `<div class="ex" data-fig="clau">`. Les claus són a la llista `F` del fitxer
  (bench, benchbar, dbbench, incline, chestpress, fly, dips, pushup, military, ohp, lateral, facepull, extrot, landmine, pushdown, overhead,
  skull, lat, pullup, rings, row, bbrow, dbrow, cablerow, bandrow, invrow, pullover, curlbar, curldb, cablecurl, inclinecurl, wrist, squat,
  bbsquat, goblet, jumpsquat, legpress, legcurl, legext, rdl, rdldb, bulgarian, bulgarsmith, lunge, lateralsquat, stepup, nordic, bridge,
  calves, seatedcalf, plank, sideplank, copenhagen, deadbug, rollout, superman, pallof, woodchop, boxjump, slam, rotthrow, chestpass,
  lateralhop, splitstep, run, walk, farmer, kbdl, balance, inclinepush, kneelpress, ytband, pogo, snapdown, rope, ladder, brake, latlunge, boxland, hipthrust, calves1, jumpstick, copenshort, wristcable, wristiso, ytbench, lathop2, latstep, bike, adductor, abductor, smithincline, machineohp, machinecurl, machinetri, smithcalves). Si un exercici nou no en té cap que encaixi, afegeix-ne un a `F` i comprova'l visualment. Les figures es dibuixen amb cos complet (gruix als membres, mans i peus; a la vista de perfil, el costat de darrere en gris), així que a la vista de perfil cal pensar quin braç i quina cama són els de davant (p. ej. dead bug: braç i cama contraris).
- `comu/entrenar.js` · pestanya ▶ Entrenar: kg i reps per sèrie, descans, historial (`#historial` a Progrés) i enviament al full.
- `comu/registre.js` · adreça de l'Apps Script (`/exec`) on s'envien els entrenos.
- `apps-script/registre.gs` · el codi de l'Apps Script del full de Google: cada client escriu a la seva pestanya `Registre <Nom>`,
  que es crea sola. El nom surt de `data-client` de `<section id="entrenar">` o, si no n'hi ha, del títol `h1`.
  Els tests i les mesures de Progrés (totes les taules menys `#cargas`) s'envien sols des de `comu/registre.js` i van a la mateixa
  pestanya, a l'A3 (taules amb color); el registre d'entrenos va a H3. Si canvies `registre.gs`, cal tornar-lo a implementar com a versió nova.

- `questionari.html` · qüestionari inicial, el mateix enllaç per a tots els clients. Les preguntes són a la llista `Q` del fitxer;
  en acabar, el client veu el resum i l'envia a l'Adrià per WhatsApp amb un botó (número a `TEL`); no passa pel full de Google.

- `app/` i `sw.js` · perquè cada pàgina es pugui instal·lar com a app al mòbil (Android: Chrome ⋮ → Instal·la l'aplicació).
  Cada HTML té el seu manifest `app/<client>.webmanifest` (enllaçat al `<head>`), les icones són a `app/` i el service worker
  `sw.js` (a l'arrel) guarda l'última còpia per si no hi ha connexió.

Si canvies alguna cosa de `comu/`, puja el número `?v=` a tots els HTML perquè els mòbils no facin servir la versió vella.

- `base.html` · planificació base comuna (perfil en 3 eixos, fases, setmanes tipus, sessió A-F, prevenció, control). És la guia de l'Adrià,
  no d'un client. `plantilla-padel.html` és la plantilla de client ja omplerta amb aquesta base (I · F1 · C2, 3 dies de força).
  Només és per als clients nous: els HTML dels clients que ja existien no s'han de passar a aquesta base.

- `prompt-rutines.md` · prompt base de l'Adrià per crear rutines físiques segons el nivell (1-4) del jugador. Quan passi la fitxa
  d'un client, segueix-lo al peu de la lletra (classificació, estructura de 7 punts, normes, preguntar dades que faltin).

- `guia-sessions-padel.pdf` i el resum `guia-sessions-padel.md` · la guia de sessions de l'Adrià per als **jugadors de pàdel**
  (7 blocs, paràmetres per nivell, escales de graons, palanques, ajustos per perfil, microcicle). És la base de tota rutina per a un
  jugador de pàdel, adaptant graó i intensitat a l'alumne. No s'aplica a clients amb un altre objectiu (p. ej. hipertròfia).
  Regla de l'Adrià per sobre de tot: mínim 3 sessions de força/setmana a qualsevol nivell + 1 o 2 partits.

## Client nou

1. Copia `plantilla.html` (o `plantilla-padel.html` per a pàdel, i adapta-la amb `base.html`) a `<nom>.html` i segueix el comentari de dalt (canviar `NOM`, omplir perfil, dies i exercicis amb `data-fig`).
2. Copia `app/plantilla.webmanifest` a `app/<nom>.webmanifest`, canvia-hi `plantilla` pel nom del fitxer i `NOM` pel nom del client,
   i al `<head>` del HTML canvia `app/plantilla.webmanifest` per `app/<nom>.webmanifest`.
3. Afegeix-lo a la taula del `README.md`.
4. No cal tocar el full de Google: la pestanya `Registre <Nom>` apareix sola el primer cop que el client envia un entreno.
