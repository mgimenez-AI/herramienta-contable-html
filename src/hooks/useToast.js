import { useCallback, useRef, useState } from 'react';

export function useToast() {
  const [flash, setFlash] = useState('');
  const timerRef = useRef(null);

  const showFlash = useCallback((msg) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlash(msg);
    timerRef.current = setTimeout(() => setFlash(''), 2600);
  }, []);

  return { flash, showFlash };
}
