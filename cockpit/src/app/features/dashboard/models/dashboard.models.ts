export interface SourceIncidentResponse {
  incidents: SourceIncident[]
}
export interface SourceIncident {
  id: number;
  title: string;
  description: string;
  severity: string;
  critically: string;
  summary: string;
  tags: string;
  status: string;
  createdAt: string;
  assets: SourceIncidentAsset[];
  creationDate: string;
  updateDate: string;
}

export interface SourceIncidentAsset {
  deck: string;
  frame: string;
  mvz: string;
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: string;
  critically: string;
  decks: number[];
  frames: number[];
  mvz: number[];
  assets: SourceIncidentAsset[];
  summary: string;
  tags: string;
  status: string;
  assetsInvolved: number;
  createdAt: Date;
  creationDate: Date;
  updateDate: Date;
}

export interface GridElement {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  orientation: string;
  lineLabel?: string;
  sectorTickness?: number;
}
export interface FunctionDto {
  id: number;
  name: string;
  parent?: FunctionDto;
  assets?: any[];
  [key: string]: any;
}

export interface FunctionNode extends FunctionDto {
  children?: FunctionNode[];
}

/**
 * Converte una stringa ISO 8601 in un oggetto Date
 * per essere usata direttamente in tabelle PrimeNG
 */
function convertIsoToDate(isoDate: string): Date {
  return new Date(isoDate);
}

/**
 * Mapper da SourceIncident a Incident
 */
export function mapSourceIncidentToIncident(source: SourceIncident): Incident {
  const decksSet = new Set<number>();
  const framesSet = new Set<number>();
  const mvzSet = new Set<number>();

  for (const asset of source.assets || []) {
    const deckNum = Number(asset.deck);
    const frameNum = Number(asset.frame);
    const mvzNum = Number(asset.mvz);

    if (!isNaN(deckNum)) {
      decksSet.add(deckNum);
    }

    if (!isNaN(frameNum)) {
      framesSet.add(frameNum);
    }

    if (!isNaN(mvzNum)) {
      mvzSet.add(mvzNum);
    }
  }

  return {
    id: source.id,
    title: source.title,
    description: source.description,
    severity: source.severity,
    critically: source.critically,
    summary: source.summary,
    tags: source.tags,
    status: source.status,
    decks: Array.from(decksSet),
    frames: Array.from(framesSet),
    mvz: Array.from(mvzSet),
    assets: source.assets ? [...source.assets] : [],
    assetsInvolved: source.assets?.length || 0,
    createdAt: convertIsoToDate(source.createdAt),
    creationDate: convertIsoToDate(source.creationDate),
    updateDate: convertIsoToDate(source.updateDate),
  };
}
