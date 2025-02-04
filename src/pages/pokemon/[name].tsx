import PokemonDetails from "@/components/PokemonDetails";
import { useRouter } from "next/router";

export default function PokemonPage() {
  const router = useRouter();
  const { name } = router.query;

  return <div>{name && <PokemonDetails />}</div>;
}
