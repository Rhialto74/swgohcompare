export module RosterModel {

  //Begin Crinolo Model Stuff
  export interface UnitData {
    unit: UnitStat;
    stats: Stats;
  }

  export interface UnitStat {
    updated: number;
    player: string;
    allyCode: number;
    type: number;
    gp: number;
    starLevel: number;
    level: number;
    gearLevel: number;
    gear: string[];
    zetas: object[];
    mods: UnitMod[];
  }
  export interface Stats {
    final: Final;
    mods: Mods;
  }

  export interface UnitMod {
    id: string;
    set: number;
    level: number;
    pips: number;
    tier: number;
    stat: number[];
  }

  export interface StatsMods {
    "Physical Damage": number;
    "Special Damage": number;
    "Armor": number;
    "Resistance": number;
    "Protection": number;
    "None": number;
    "Health": number;
    "Physical Critical Chance": number;
    "Special Critical Chance": number;
  }

  export interface Final {
    Strength: number;
    Agility: number;
    Intelligence: number;
    Speed: number;
    Health: number;
    "Physical Damage": number;
    Potency: number;
    Tenacity: number;
    Armor: number;
    Resistance: number;
    "Physical Critical Chance": number;
    Protection: number;
    "Special Damage": number;
    "Critical Damage": number;
    "Special Critical Chance": number;
    "Armor Penetration": number;
    "None": 0
  }
  //End Crinolo Model Stuff

  export interface Roster {
    playerName:string;
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
    constructor(public name: string, public imageUrl: string, public position: number, public equipped: boolean) { };
  }

  export interface PlayerInformation {
    playerNames: string[];
    unitStatList: UnitData[]
    rosterList: Roster[];
    unitInfo: UnitTierList[];
  }

  export interface UnitTierList {
    tier: number;
    equipmentSetList: string[];
  }
}
