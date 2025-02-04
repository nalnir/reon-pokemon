import { PokemonType } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ types: PokemonType[] }>
) {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const data = await response.json();

    // Extract only relevant type data
    const types = data.results.map((type: PokemonType) => ({
      name: type.name,
      url: type.url,
    }));

    console.log("types: ", types);
    res.status(200).json({ types });
  } catch (error) {
    console.error("Error fetching Pokémon types:", error);
    res.status(500).json({ types: [] });
  }
}
