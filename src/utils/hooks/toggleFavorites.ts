import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage when the component mounts
  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(savedFavorites);
  }, []);

  // Toggle Favorite Function
  const toggleFavorite = (pokemonName: string) => {
    const updatedFavorites = favorites.includes(pokemonName)
      ? favorites.filter((fav) => fav !== pokemonName) // Remove from favorites
      : [...favorites, pokemonName]; // Add to favorites

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return { favorites, toggleFavorite };
}
