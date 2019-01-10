export module GearModel {
  export interface Gear {
    base_id: string;
    cost: number;
    image: string;
    ingredients: Ingredient[];
    mark: string;
    name: string;
    recipes: Recipe[];
    required_level: number;
    stats: object[];
    tier: string;
    url: string;
  }
  export interface Ingredient{
    amount: number;
    gear: string;
  }

  export interface Recipe{
    base_id: string;
    cost: number;
    ingredients: Ingredient[];
    result_id: string;
  }
  
}
