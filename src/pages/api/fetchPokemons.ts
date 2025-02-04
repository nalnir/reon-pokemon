// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Pokemon, PokemonData } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ pokemons: Pokemon[] }>
) {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await response.json();

    const pokemonDetails: Pokemon = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const detailsResponse = await fetch(pokemon.url);
        const details: PokemonData = await detailsResponse.json();
        return {
          name: pokemon.name,
          url: pokemon.url,
          data: details,
        };
      })
    );

    res.status(200).json({ pokemons: pokemonDetails });
  } catch (error) {
    res.status(500).json({ pokemons: [] });
  }
}
