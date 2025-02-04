export interface Pokemon {
  name: string;
  url: string;
  data: PokemonData;
}

export interface PokemonData {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  order: number;
  is_default: boolean;
  location_area_encounters: string;

  abilities: Ability[];
  forms: NamedAPIResource[];
  game_indices: GameIndex[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  held_items: any[]; // Update with correct type if needed
  moves: Move[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  past_abilities: any[]; // Empty array, update with correct type if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  past_types: any[]; // Empty array, update with correct type if needed
  species: NamedAPIResource;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];

  cries: {
    latest: string;
    legacy: string;
  };
}

export interface PokemonType {
  name: string;
  url: string;
}

interface Ability {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

interface Move {
  move: NamedAPIResource;
}

interface GameIndex {
  game_index: number;
  version: NamedAPIResource;
}

interface NamedAPIResource {
  name: string;
  url: string;
}

interface Sprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
}

interface Stat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

interface Type {
  slot: number;
  type: NamedAPIResource;
}
