// AUTO-GENERATED from docs/pathfinder-v5-reference.html by
// scripts/gen-v5-data.mjs. Phase 1 — personality questions (-> 4 dimensions -> archetype).
// Italian is authored; en/he are empty until a copywriter fills them
// (tracked by src/data/v5-content.test.ts). Do not hand-edit Italian here —
// edit the prototype and regenerate. DO hand-edit en/he, then stop regenerating.

import type { P1Question } from '@/lib/types';

export const PHASE1_QUESTIONS: P1Question[] = [
  {
    id: "p1q01", dimension: "DIM_1", text: { it: "Come affronti un problema complesso che non hai mai visto prima?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Cerco subito una soluzione pratica e concreta", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Parlo con qualcuno che l'ha già affrontato", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Studio e ricerco tutto quello che esiste sull'argomento", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Ripenso il problema da zero, cerco un angolo completamente nuovo", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Varia molto — dipende dal tipo di problema", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q02", dimension: "DIM_1", text: { it: "Quale tipo di attività ti fa perdere completamente il senso del tempo?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Qualcosa di fisico con risultati concreti e immediati", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Pianificare, organizzare, strutturare qualcosa di complesso", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Studiare, analizzare, capire qualcosa in profondità", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Creare qualcosa che non esisteva prima", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Non ho un'attività specifica — dipende dal periodo", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q03", dimension: "DIM_1", text: { it: "Quando devi imparare qualcosa di nuovo da zero, come inizi?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Provo subito — imparo facendo errori", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Seguo un corso o una guida strutturata", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Leggo e ricerco tutto quello che esiste prima di toccare qualcosa", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Esploro liberamente finché capisco la logica profonda", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Dipende da cosa devo imparare", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q04", dimension: "DIM_1", text: { it: "Come prendi le decisioni importanti della tua vita?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "In modo rapido e istintivo — poi aggiusto se serve", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Con una lista pro/contro, ragionando sui numeri", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Ricercando molto e consultando fonti diverse prima di decidere", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Seguendo la visione a lungo termine, anche se incerta", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Dipende dalla dimensione della decisione", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q05", dimension: "DIM_2", text: { it: "Dopo una giornata intera a lavorare completamente da solo, come ti senti?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Benissimo — è il mio stato ideale", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Bene, ma apprezzo un po' di interazione ogni tanto", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Un po' a disagio — mi manca il contatto umano", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Male — ho bisogno di persone intorno per funzionare", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Dipende dal tipo di lavoro che stavo facendo", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q06", dimension: "DIM_2", text: { it: "In un gruppo di lavoro, quale ruolo assumi naturalmente?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Lavoro da solo sulla mia parte e mi coordino il minimo necessario", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Contribuisco con le mie competenze quando viene richiesto", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Partecipo attivamente alle discussioni e alle decisioni", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Prendo la guida e coordino gli altri", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Non ho un ruolo fisso — mi adatto alla situazione", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q07", dimension: "DIM_2", text: { it: "Ti viene chiesto di presentare un progetto importante davanti a un gruppo. Come ti senti?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Preferirei mandarlo per iscritto — non è il mio forte", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Ok, ma mi preparo molto in anticipo", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Mi piace — mi dà soddisfazione comunicare bene", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Lo adoro — le presentazioni mi danno energia", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Dipende molto dal pubblico e dal contesto", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q08", dimension: "DIM_3", text: { it: "Nel lavoro, cosa ti dà la maggiore soddisfazione personale?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Completare una lista di task con efficienza e precisione", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Trovare la soluzione a un problema complesso", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Creare qualcosa di bello o che comunica bene", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Inventare qualcosa che prima non esisteva", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Varia molto — non ho una preferenza unica", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q09", dimension: "DIM_3", text: { it: "Quale complimento professionale ti fa più piacere ricevere?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "'Sei incredibilmente affidabile e organizzato'", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "'Sei brillante — vai in profondità dove altri non arrivano'", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "'Riesci sempre a ispirare e coinvolgere le persone'", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "'Sei originale — pensi in modo unico, non esiste nessuno come te'", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Dipende dal periodo e da chi lo dice", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q10", dimension: "DIM_3", text: { it: "Cosa ti annoia o frustra di più al lavoro?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Non avere una struttura chiara e un piano definito", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Compiti ripetitivi senza stimolo intellettuale", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Lavorare su qualcosa di anonimo, senza identità o significato", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Seguire regole e processi imposti da altri senza capirne il senso", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Dipende — ogni contesto è diverso", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q11", dimension: "DIM_3", text: { it: "Come vorresti sentirti nel tuo lavoro ideale?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Produttivo ed efficiente — risultati misurabili ogni giorno", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Intelligente e competente — riconosciuto per la mia profondità", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Creativo ed espressivo — il mio lavoro porta la mia firma", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Libero e unico — faccio qualcosa che non fa nessun altro", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Non saprei — è difficile definirlo con una parola sola", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q12", dimension: "DIM_4", text: { it: "Ti offrono due opportunità di lavoro. Quale scegli?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Stipendio fisso alto, grande azienda stabile, percorso chiaro", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Stipendio medio con flessibilità totale su orari e modalità", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Guadagno variabile ma fai esattamente quello che ami", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Zero fisso — costruisci qualcosa di tuo da zero", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Dipende da altri fattori della mia vita in questo momento", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q13", dimension: "DIM_4", text: { it: "Come ti senti all'idea di non sapere quanto guadagnerai il mese prossimo?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Molto a disagio — la stabilità economica è essenziale per me", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Un po' scomodo, ma gestibile se c'è prospettiva", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Ok se l'upside potenziale vale il rischio", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Eccitante — l'incertezza è dove nascono le opportunità", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Non l'ho mai vissuto — non so come reagirei", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q14", dimension: "DIM_4", text: { it: "In 5 anni, dove ti vedi idealmente?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Ruolo senior consolidato in un'azienda solida e rispettata", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Esperto riconosciuto nel mio campo, ben pagato per le mie competenze", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Freelance o consulente autonomo con clienti selezionati", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Fondatore di qualcosa di mio — che porta il mio nome nel mondo", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Non ho ancora una visione chiara del futuro", en: '', he: '' }, score: null, neutral: true },
    ],
  },
  {
    id: "p1q15", dimension: "DIM_4", text: { it: "Se i soldi non fossero mai un problema, cosa faresti da domani?", en: '', he: '' },
    options: [
    { id: "o1", text: { it: "Lo stesso lavoro attuale — mi dà sicurezza e identità", en: '', he: '' }, score: 0 },
    { id: "o2", text: { it: "Lo stesso ma con meno pressione e più attenzione alla qualità", en: '', he: '' }, score: 1 },
    { id: "o3", text: { it: "Qualcosa di completamente diverso nel campo che amo davvero", en: '', he: '' }, score: 2 },
    { id: "o4", text: { it: "Costruirei qualcosa di mio, da zero, senza nessun limite", en: '', he: '' }, score: 3 },
    { id: "o5", text: { it: "Non lo so — non ci ho mai pensato seriamente", en: '', he: '' }, score: null, neutral: true },
    ],
  },
];
