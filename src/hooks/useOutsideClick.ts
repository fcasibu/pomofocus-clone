import type { RefObject } from 'react';
import { useCallback, useEffect } from 'react';

export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  callback: (event: Event) => void,
) {
  const handleMouseDown = useCallback((event: Event) => {
    const element = ref?.current;
    if (element && !element.contains(event.target as HTMLElement)) {
      callback(event);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('ontouchstart', handleMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('ontouchstart', handleMouseDown);
    };
  }, [ref, callback]);
}
