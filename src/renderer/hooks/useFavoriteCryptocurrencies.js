import { useEffect, useState } from "react";
import { getKey } from "~/renderer/storage";

export function useFavoriteCryptocurrencies() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function getFavorites() {
      const res = await getKey("app", "favorite_cryptocurrencies", []);
      setFavorites(res);
    }

    getFavorites();
  }, []);

  return favorites;
}
