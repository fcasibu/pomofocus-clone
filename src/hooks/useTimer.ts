import { TimerContext } from '@context';
import { useContext } from 'react';

export function useTimer() {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error(`useTimer must be used inside a TimerProvider`);
  }

  return context;
}
