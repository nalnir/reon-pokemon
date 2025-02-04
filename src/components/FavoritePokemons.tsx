import Image from "next/image";
import { Pokemon } from "@/utils/types";
import { useFavorites } from "@/utils/hooks/toggleFavorites";
import { useEffect, useState } from "react";

export default function FavoritePokemons({
  filteredPokemons,
}: {
  filteredPokemons: Pokemon[];
}) {
  const { favorites, toggleFavorite } = useFavorites();
  const [filteredFavorites, setFilteredFavorites] = useState<Pokemon[]>([]);

  // Update filtered favorites when 'favorites' or 'filteredPokemons' change
  useEffect(() => {
    const favoriteSet = new Set(favorites); // Convert to Set for O(1) lookup
    setFilteredFavorites(
      filteredPokemons.filter((pokemon) => favoriteSet.has(pokemon.name))
    );
  }, [favorites, filteredPokemons]);

  return (
    <div className="grid grid-cols-5 gap-3">
      {filteredFavorites.length === 0 ? (
        <p className="col-span-5 text-center text-gray-500">
          No favorite Pokémon found.
        </p>
      ) : (
        filteredFavorites.map((pokemon, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border border-white col-span-1 cursor-pointer flex flex-col justify-center items-center"
          >
            <Image
              alt="Pokemon sprite"
              src={pokemon.data.sprites.front_default ?? ""}
              width={100}
              height={100}
            />
            <p className="capitalize">{pokemon.name}</p>
            <button
              className={`p-1 rounded-lg ${
                favorites.includes(pokemon.name) ? "bg-red-500" : "bg-blue-500"
              } text-white`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent routing when clicking the button
                toggleFavorite(pokemon.name);
              }}
            >
              {favorites.includes(pokemon.name)
                ? "Remove Favorite"
                : "Add to Favorite"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
