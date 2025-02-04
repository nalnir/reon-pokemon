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
  }, []);
  useEffect(() => {
    getPokemons();
  }, []);

  const getPokemons = async () => {
    try {
      const res = await fetch("/api/fetchPokemons"); // Ensure this matches your API route filename
      const data: { pokemons: Pokemon[] } = await res.json(); // Parse JSON
      setPokemons([...data.pokemons]);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    }
  };

  const getPokemonTypes = async () => {
    try {
      const res = await fetch("/api/fetchPokemonTypes"); // Ensure this matches your API route filename
      const data: { types: PokemonType[] } = await res.json(); // Parse JSON
      console.log("data: ", data);
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
      className={`${geistSans.variable} ${geistMono.variable} flex flex-row items-center justify-items-center min-h-screen p-8 pb-20 gap-3 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <div className="gap-3 row-start-2 items-center sm:items-start flex flex-col w-full">
        <div className="flex flex-row items-center w-full gap-3">
          <input
            className="flex w-full p-1 rounded-lg border border-gray-300"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PokemonTypeMenu
            selectedType={typeFilter}
            pokemonTypes={pokemonTypes}
            selectType={(type) => setTypeFilter(type)}
          />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {filteredPokemons.map((pokemon, i) => {
            return (
              <div
                onClick={() => router.push(`/pokemon/${pokemon.name}`)}
                key={i}
                className="p3 rounded-lg border border-white col-span-1 cursor-pointer flex flex-col justify-center items-center"
              >
                <Image
                  alt="Pokemon sprite"
                  src={pokemon.data.sprites.front_default ?? ""}
                  width={100}
                  height={100}
                />
                <p>{pokemon.name}</p>
                <button
                  className={`p-1 rounded-lg ${
                    favorites.includes(pokemon.name)
                      ? "bg-red-500"
                      : "bg-blue-500"
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
          })}
        </div>
      </div>
      <div className="w-full">
        <FavoritePokemons filteredPokemons={filteredPokemons} />
      </div>
    </main>
  );
}
