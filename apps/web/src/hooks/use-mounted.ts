import { useEffect, useState } from 'react';

/**
 * Hook qui retourne true une fois que le composant est monté côté client.
 * Utile pour éviter les hydration mismatches avec SSR.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

