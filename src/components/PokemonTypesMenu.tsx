import { useState, useRef, useEffect } from "react";

export default function PokemonTypeMenu({
  pokemonTypes,
  selectType,
  selectedType,
}: {
  pokemonTypes: { name: string }[];
  selectType: (type: string | null) => void;
  selectedType: string | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col items-start" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {!selectedType ? "All types" : selectedType}
      </button>

      {menuOpen && (
        <div className="absolute rounded-lg mt-2 bg-white p-3 z-20 flex flex-col gap-3 h-48 overflow-y-scroll shadow-lg">
          <div className="cursor-pointer" onClick={() => selectType(null)}>
            <p className="text-black">All types</p>
          </div>
          {pokemonTypes.map((pt, i) => (
            <div
              key={i}
              className="cursor-pointer"
              onClick={() => selectType(pt.name.toLowerCase())}
            >
              <p className="text-black">{pt.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
