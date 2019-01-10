export module RosterModel {
export interface Roster {
  id: string;
  defId: string;
  nameKey: string;
  rarity: number;
  level: number;
  xp: number;
  gear: number;
  equipped: Equipped[];
  combatType: string;
  skills: Skills[];
  mods: Mods[];
  crew: Crew[];
  gp: number;
  character: CharacterGear;
}

export interface Crew {
  unitId: string;
  slot: number;
  skillReferenceList: SkillReferenceList[];
  gp: number;
  cp: number;
}

  export interface SkillReferenceList {
  skillId: string;
  requiredTier: number;
  requiredRarity: number;
}

  export interface Mods {
  id: string;
  level: number;
  tier: number;
  slot: number;
  set: number;
  pips: number;
  primaryStat: PrimaryStat;
  secondaryStat: SecondaryStat[];
}

  export interface PrimaryStat {
  unitStat: string;
  value: number;
}

  export interface SecondaryStat {
  unitStat: string;
  value: number;
  roll: number;
}

  export interface Skills {
  id: string;
  tier: number;
  nameKey: string;
  isZeta: boolean;
}
  export interface Equipped {
  equipmentId: string;
  slot: string;
  nameKey: string;
}

  export interface LocalizedUnit {
  nameKey: string;
  baseId: string;
  }
  export class CharacterGear {
    id: number;
    gearSlots: GearDetails[];
    constructor() {
      this.gearSlots = [];
    }
  }
  export class GearDetails {
    constructor(public name: string, public imageUrl: string) { };
  }
}
