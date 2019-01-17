export module AbilityModel {
  export interface Ability {
    base_id: string;
    name: string;
    image: string;
    url: string;
    tier_max: number;
    is_zeta: boolean;
    is_omega: boolean;
    combat_type: number;
    type: number;
    character_base_id: string;
  }
}


