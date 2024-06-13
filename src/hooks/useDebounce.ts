import { useEffect, useState } from "react";

export function useDebounce(cb: string, delay: number) {
  const [debounceValue, setDebounceValue] = useState<string>(cb);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(cb);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [cb, delay]);

  return debounceValue;
}
