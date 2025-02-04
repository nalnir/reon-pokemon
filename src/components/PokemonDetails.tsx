import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PokemonData } from "@/utils/types";
import Image from "next/image";
import { useFavorites } from "@/utils/hooks/toggleFavorites";

export default function PokemonDetails() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const { name } = router.query;
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name) return;

    fetch(`/api/pokemon/${name}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPokemon(data);
      })
      .catch(() => setError("Failed to fetch Pokémon"));
  }, [name]);

  if (error)
    return <p className="text-red-500 text-lg text-center mt-10">{error}</p>;
  if (!pokemon) return <p className="text-lg text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-orange-300 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center border border-gray-200">
        <h1 className="text-3xl font-bold capitalize text-gray-800">
          {pokemon.name}
        </h1>
        <Image
          height={200}
          width={200}
          src={pokemon.sprites.front_default ?? ""}
          alt={pokemon.name}
          className="mx-auto my-4 drop-shadow-lg"
        />
        <div className="text-lg text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Base Experience:</span>{" "}
            {pokemon.base_experience}
          </p>
          <p>
            <span className="font-semibold">Height:</span> {pokemon.height / 10}{" "}
            m
          </p>
          <p>
            <span className="font-semibold">Weight:</span> {pokemon.weight / 10}{" "}
            kg
          </p>
        </div>
        <button
          className={`mt-4 px-6 py-2 text-lg text-white font-semibold rounded-lg transition duration-300 ${
            favorites.includes(pokemon.name)
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(pokemon.name);
          }}
        >
          {favorites.includes(pokemon.name)
            ? "Remove Favorite"
            : "Add to Favorite"}
        </button>
      </div>
    </div>
  );
}
