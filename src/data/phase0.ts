// AUTO-GENERATED from docs/pathfinder-v5-reference.html by
// scripts/gen-v5-data.mjs. Phase 0 — visual profiling stimuli.
// Italian is authored; en/he are empty until a copywriter fills them
// (tracked by src/data/v5-content.test.ts). Do not hand-edit Italian here —
// edit the prototype and regenerate. DO hand-edit en/he, then stop regenerating.

import type {
  ColorStimulus,
  ShapeStimulus,
  SpaceStimulus,
  ImageStimulus,
} from '@/lib/types';

export const P0_COLORS: ColorStimulus[] = [
  { id: "blu", hex: "#1A3A5C", desc: { it: "profondità analitica", en: '', he: '' }, dim: { DIM_1: 10, DIM_4: -8 } },
  { id: "verde", hex: "#2D7A4F", desc: { it: "autonomia interiore", en: '', he: '' }, dim: { DIM_1: 8, DIM_2: -8 } },
  { id: "rosso", hex: "#C1121F", desc: { it: "energia e azione", en: '', he: '' }, dim: { DIM_4: 12, DIM_3: 8 } },
  { id: "giallo", hex: "#F4C430", desc: { it: "ottimismo e creatività", en: '', he: '' }, dim: { DIM_3: 10, DIM_2: 10 } },
  { id: "viola", hex: "#7B2FBE", desc: { it: "intuizione e sensibilità", en: '', he: '' }, dim: { DIM_3: 12, DIM_1: 5 } },
  { id: "marrone", hex: "#8B5E3C", desc: { it: "radicamento e fisicità", en: '', he: '' }, dim: { DIM_1: -5, DIM_3: -5 } },
  { id: "nero", hex: "#1C1C1C", desc: { it: "controllo e precisione", en: '', he: '' }, dim: { DIM_1: 8, DIM_4: -5 } },
  { id: "grigio", hex: "#8D9099", desc: { it: "neutralità e apertura", en: '', he: '' }, dim: {  } },
];

export const P0_SHAPES: ShapeStimulus[] = [
  { id: "square", name: { it: "Quadrato", en: '', he: '' }, desc: { it: "Organizzato, preciso, logico", en: '', he: '' }, archBias: "specialist", svg: "<rect x=\"15\" y=\"15\" width=\"70\" height=\"70\" rx=\"4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\"/>" },
  { id: "triangle", name: { it: "Triangolo", en: '', he: '' }, desc: { it: "Ambizioso, deciso, orientato agli obiettivi", en: '', he: '' }, archBias: "builder", svg: "<polygon points=\"50,8 92,88 8,88\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\" stroke-linejoin=\"round\"/>" },
  { id: "circle", name: { it: "Cerchio", en: '', he: '' }, desc: { it: "Armonioso, empatico, relazionale", en: '', he: '' }, archBias: "connector", svg: "<circle cx=\"50\" cy=\"50\" r=\"38\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\"/>" },
  { id: "lightning", name: { it: "Fulmine", en: '', he: '' }, desc: { it: "Creativo, intuitivo, non-conformista", en: '', he: '' }, archBias: "creator", svg: "<polyline points=\"58,5 34,52 52,52 42,95 66,40 48,40 58,5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\" stroke-linejoin=\"round\"/>" },
  { id: "rectangle", name: { it: "Rettangolo", en: '', he: '' }, desc: { it: "In trasformazione, flessibile, esplorativo", en: '', he: '' }, archBias: null, svg: "<rect x=\"8\" y=\"28\" width=\"84\" height=\"44\" rx=\"4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\"/>" },
];

export const P0_SPACES: SpaceStimulus[] = [
  { id: "solo", emoji: "📚", name: { it: "Studio privato", en: '', he: '' }, desc: { it: "Silenzio, concentrazione, nessuna interruzione", en: '', he: '' }, bg: "linear-gradient(135deg,#1A3A5C,#0D2035)", domHint: "KNO" },
  { id: "social", emoji: "👥", name: { it: "Open space vibrante", en: '', he: '' }, desc: { it: "Persone, energia, collaborazione costante", en: '', he: '' }, bg: "linear-gradient(135deg,#2C6FAC,#1A4A7A)", domHint: "PEO" },
  { id: "creative", emoji: "🎨", name: { it: "Atelier creativo", en: '', he: '' }, desc: { it: "Materiali, libertà, espressione personale", en: '', he: '' }, bg: "linear-gradient(135deg,#C1121F,#8B0000)", domHint: "ART" },
  { id: "nature", emoji: "🌿", name: { it: "Natura e aria aperta", en: '', he: '' }, desc: { it: "Silenzio naturale, luce, connessione", en: '', he: '' }, bg: "linear-gradient(135deg,#2D6A4F,#1B4332)", domHint: "NAT" },
  { id: "luxury", emoji: "💎", name: { it: "Ambiente raffinato", en: '', he: '' }, desc: { it: "Qualità, estetica, eccellenza in ogni dettaglio", en: '', he: '' }, bg: "linear-gradient(135deg,#5C2D91,#3A1A5C)", domHint: "LUX" },
  { id: "lab", emoji: "💻", name: { it: "Lab tecnologico", en: '', he: '' }, desc: { it: "Dati, sistemi, precisione, innovazione", en: '', he: '' }, bg: "linear-gradient(135deg,#1C3A1C,#0D200D)", domHint: "TEC" },
];

export const P0_STIMULI: ImageStimulus[] = [
  { id: "growth", emoji: "📈", name: { it: "Una curva di crescita", en: '', he: '' }, desc: { it: "Mercati, numeri, opportunità, scalabilità", en: '', he: '' }, bg: "linear-gradient(135deg,#1A3A5C,#0D2035)", domHint: "FIN" },
  { id: "art", emoji: "🖌️", name: { it: "Un'opera d'arte incompiuta", en: '', he: '' }, desc: { it: "Creatività, bellezza, espressione, unicità", en: '', he: '' }, bg: "linear-gradient(135deg,#C1121F,#E8A020)", domHint: "ART" },
  { id: "network", emoji: "🕸️", name: { it: "Una rete di connessioni", en: '', he: '' }, desc: { it: "Persone, relazioni, influenza, community", en: '', he: '' }, bg: "linear-gradient(135deg,#2D6A4F,#1B4332)", domHint: "PEO" },
  { id: "mechanism", emoji: "⚙️", name: { it: "Un meccanismo perfetto", en: '', he: '' }, desc: { it: "Sistemi, logica, precisione, comprensione", en: '', he: '' }, bg: "linear-gradient(135deg,#3A2A1A,#5C3A1C)", domHint: "TEC" },
];
