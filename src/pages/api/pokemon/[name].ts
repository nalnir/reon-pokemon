import { PokemonData } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query; // Get the Pokémon name from the URL

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Pokémon name is required" });
  }

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    if (!response.ok) throw new Error("Pokémon not found");

    const data: PokemonData = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Pokémon not found" });
  }
}
