import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { Pokemon, PokemonType } from "@/utils/types";
import PokemonTypeMenu from "@/components/PokemonTypesMenu";
import { useRouter } from "next/router";
import FavoritePokemons from "@/components/FavoritePokemons";
import { useFavorites } from "@/utils/hooks/toggleFavorites";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]);
  const [typeFilter, setTypeFilter] = useState<null | string>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getPokemonTypes();
    getPokemons();
  }, []);

  const getPokemons = async () => {
    try {
      const res = await fetch("/api/fetchPokemons");
      const data: { pokemons: Pokemon[] } = await res.json();
      setPokemons([...data.pokemons]);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    }
  };

  const getPokemonTypes = async () => {
    try {
      const res = await fetch("/api/fetchPokemonTypes");
      const data: { types: PokemonType[] } = await res.json();
      setPokemonTypes([...data.types]);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    }
  };

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesName = pokemon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      !typeFilter ||
      pokemon.data.types.some(
        (t: { type: { name: string } }) => t.type.name === typeFilter
      );
    return matchesName && matchesType;
  });

  return (
    <main
      className={`${geistSans.variable} ${geistMono.variable} flex flex-col items-center min-h-screen p-8 sm:p-20 font-sans bg-gradient-to-br from-blue-100 to-blue-300`}
    >
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center w-full gap-3 bg-white shadow-lg p-4 rounded-lg max-w-4xl border border-gray-200">
        <input
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          placeholder="Search Pokémon by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <PokemonTypeMenu
          selectedType={typeFilter}
          pokemonTypes={pokemonTypes}
          selectType={(type) => setTypeFilter(type)}
        />
      </div>

      {/* Pokémon Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-8 w-full max-w-6xl">
        {filteredPokemons.map((pokemon, i) => (
          <div
            key={i}
            onClick={() => router.push(`/pokemon/${pokemon.name}`)}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl cursor-pointer flex flex-col items-center transition duration-300 transform hover:scale-105 border border-gray-200 hover:border-blue-400"
          >
            <Image
              alt="Pokemon sprite"
              src={pokemon.data.sprites.front_default ?? ""}
              width={120}
              height={120}
              className="drop-shadow-lg"
            />
            <p className="mt-3 font-bold text-lg capitalize text-gray-800">
              {pokemon.name}
            </p>
            <button
              className={`mt-3 px-4 py-2 text-white rounded-lg transition text-lg ${
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
        ))}
      </div>

      {/* Favorite Pokémon Section */}
      <div className="w-full max-w-6xl mt-12 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Favorite Pokémon
        </h2>
        <FavoritePokemons filteredPokemons={filteredPokemons} />
      </div>
    </main>
  );
}
