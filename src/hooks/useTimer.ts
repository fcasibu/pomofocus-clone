import { useContext } from 'react';
import { TimerContext } from '@context';

export function useTimer() {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error(`useTimer must be used inside a TimerProvider`);
  }

  return context;
}
