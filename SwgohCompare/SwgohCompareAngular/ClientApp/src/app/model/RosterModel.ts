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
    mods: StatsMods;
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
    Health: number;
    Protection: number;
    Speed: number;
    "Critical Damage": number;
    Potency: number;
    Tenacity: number;
    "Health Steal": number;
    "Defense Penetration": number;
    "Physical Damage": number;
    "Physical Critical Chance": number;
    "Armor Penetration": number;
    Accuracy: number;
    Armor: number;
    "Dodge Chance": number;
    "Critical Avoidance": number;
    "Special Damage": number;
    "Special Critical Chance": number;
    "Resistance Penetration": number;
    Resistance: number;
  }

  export interface Final {
    Strength: number;
    Agility: number;
    Tactics: number;
    Health: number;
    Protection: number;
    Speed: number;
    "Critical Damage": number;
    Potency: number;
    Tenacity: number;
    "Health Steal": number;
    "Defense Penetration": number;
    "Physical Damage": number;
    "Physical Critical Chance": number;
    "Armor Penetration": number;
    Accuracy: number;
    Armor: number;
    "Dodge Chance": number;
    "Critical Avoidance": number;
    "Special Damage": number;
    "Special Critical Chance": number;
    "Resistance Penetration": number;
    Resistance: number;
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

  export class MapObjectLookup {
    constructor(public statName: string, public statValueP1: object, public statValueP2: object, public players: string[]) { };
  }
}
