import type { Dispatch } from 'react';
import { useCallback, useLayoutEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSafeDispatch(dispatch: Dispatch<any>) {
  const mounted = useRef(false);

  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useCallback((action: any) => (mounted.current ? dispatch(action) : void 0), [dispatch]);
}
