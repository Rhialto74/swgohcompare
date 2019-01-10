export module CharacterComparer {
  export class CharacterGear {
    id: number;
    gearSlots: GearDetails[] = [];
  }
  export class GearDetails {
    constructor(public imageUrl: string, public name: string) { };
  }
}
