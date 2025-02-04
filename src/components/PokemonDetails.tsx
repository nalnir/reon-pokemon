import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PokemonData } from "@/utils/types";
import Image from "next/image";
import { useFavorites } from "@/utils/hooks/toggleFavorites";

export default function PokemonDetails() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const { name } = router.query; // Get the Pokémon name from the URL
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name) return;

    fetch(`/api/pokemon/${name}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        if (data.error) setError(data.error);
        else setPokemon(data);
      })
      .catch(() => setError("Failed to fetch Pokémon"));
  }, [name]);

  if (error) return <p>{error}</p>;
  if (!pokemon) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">{pokemon.name}</h1>
      <Image
        height={200}
        width={200}
        src={pokemon.sprites.front_default ?? ""}
        alt={pokemon.name}
      />
      <p>Base Experience: {pokemon.base_experience}</p>
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <button
        className={`p-1 rounded-lg ${
          favorites.includes(pokemon.name) ? "bg-red-500" : "bg-blue-500"
        } text-white`}
        onClick={(e) => {
          e.stopPropagation(); // Prevent navigation when clicking the button
          toggleFavorite(pokemon.name);
        }}
      >
        {favorites.includes(pokemon.name)
          ? "Remove Favorite"
          : "Add to Favorite"}
      </button>
    </div>
  );
}
