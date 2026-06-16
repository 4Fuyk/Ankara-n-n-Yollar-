export enum Difficulty {
  KOLAY = 'KOLAY',
  NORMAL = 'NORMAL',
  ZOR = 'ZOR'
}

export enum Ideology {
  SOSYAL_DEMOKRAT = 'Sosyal Demokrat',
  MUHAFAZAKAR = 'Muhafazakar',
  MILLIYETCI = 'Milliyetçi',
  LIBERAL = 'Liberal',
  SOSYALIST = 'Sosyalist'
}

export interface PortraitConfig {
  hairType: 'parted' | 'full' | 'shaved' | 'classic' | 'wavy';
  hairColor: string;
  glassesType: 'none' | 'classic' | 'round' | 'bold';
  mustacheType: 'none' | 'thin' | 'thick' | 'political';
  skinTone: string;
  suitColor: string;
  tieColor: string;
  expression: 'neutral' | 'happy' | 'serious' | 'confident';
}

export interface Party {
  id: string;
  name: string;
  shortName: string;
  leader: string;
  color: string;
  ideology: Ideology;
  support: number; // percentage (0-100) nationwide
  budget: number; // TL
  isPlayer: boolean;
  allianceId: string | null;
  relationshipWithPlayer: number; // -100 to 100
  basePopularity: number; // multiplier
  popularityTrends: number[];
  portrait?: PortraitConfig;
  tenureYears?: number; // Liderlik süresi (yıl)
}

export interface Alliance {
  id: string;
  name: string;
  parties: string[]; // party IDs
  isPlayerAlliance: boolean;
}

export interface Province {
  id: number; // plate number (1-81)
  name: string;
  regionId: string;
  voterCount: number;
  demographics: {
    muhafazakar: number; // 0-1 ratio
    milliyetci: number; // 0-1 ratio
    sosyalDemokrat: number; // 0-1 ratio
    sosyalist: number; // 0-1 ratio
    liberal: number; // 0-1 ratio
  };
  votes: Record<string, number>; // partyShortName -> percentage (0-100)
}

export interface Region {
  id: string;
  name: string;
  color: string;
}

export interface EventChoice {
  text: string;
  effectText: string;
  oyEtkisi: number; // national multiplier
  butceEtkisi: number; // TL
  demographicSwings?: {
    muhafazakar?: number;
    milliyetci?: number;
    sosyalDemokrat?: number;
    sosyalist?: number;
    liberal?: number;
  };
  relationshipEffects?: Record<string, number>; // partyShortName -> amount
}

export interface PoliticalEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  category: 'MEDYA' | 'GÜNDEM' | 'EKONOMİ' | 'KRİZ' | 'DIŞ_POLİTİKA' | 'SOSYAL';
}

export interface GameLog {
  week: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface RivalInteraction {
  id: string;
  senderPartyId: string;
  type: 'request' | 'taunt' | 'praise';
  message: string;
  options?: {
    text: string;
    action: string; // 'accept' | 'decline' | 'retaliate' | 'ignore' | 'thank'
    budgetEffect?: number;
    relationshipEffect?: number;
    supportEffect?: number;
  }[];
}

export interface CitizenChat {
  id: string;
  location: string;
  groupName: string;
  problem: string;
  choices: {
    text: string;
    answer: string; // leader's response
    supportEffect: number; // support change
    budgetEffect: number; // cost/gain of choice
    logMessage: string;
  }[];
}

export interface TbmmSession {
  id: string;
  week: number;
  billTitle: string;
  billDescription: string;
  options: {
    text: string;
    action: string;
    outcomeTitle: string;
    outcomeDescription: string;
    supportEffect: number; // national swing %
    budgetEffect: number; // TL change
    relationshipDelta: Record<string, number>; // partyShortName -> offset relation
    slogan: string;
  }[];
}

export interface GameState {
  playerParty: Party | null;
  difficulty: Difficulty;
  weeksRemaining: number;
  parties: Party[];
  alliances: Alliance[];
  provinces: Province[];
  currentEvent: PoliticalEvent | null;
  activeRivalInteraction?: RivalInteraction | null; // Rival direct message or request
  activeCitizenChat?: CitizenChat | null; // Interactive tea/dialog with citizens
  activeKurultay?: boolean | null; // Interactive party congress modal
  activeTbmmSession?: TbmmSession | null; // Interactive parliament voting modal
  logs: GameLog[];
  kulisChats: string[];
  chatHistories: Record<string, { sender: string; text: string; week: number }[]>;
  currentWeek: number;
  pollExpiryWeek: number;
  isElectionStarted: boolean;
  selectedRegionId: string | null;
  allianceProposals: string[]; // party IDs who offered alliance
  gameEnded: boolean;
  lobbyCode?: string;
  isMultiplayer?: boolean;
  electionResults: {
    provinceWinners: Record<number, string>; // provId -> partyShortName
    regionalVotes: Record<string, Record<string, number>>; // regionId -> partyShortName -> %
    totalVotes: Record<string, number>; // partyShortName -> %
    totalSeats: Record<string, number>; // partyShortName -> parliamentary seats (600 seats)
  } | null;
}
