import type { TIMER_NAME } from '../constants';

export type TimerName = keyof typeof TIMER_NAME;

// Credits to: https://www.raygesualdo.com/posts/flattening-object-keys-with-typescript-types
export type FlattenObjectKeys<
  T extends Record<string, unknown>,
  K = keyof T,
> = K extends string
  ? T[K] extends Record<string, unknown>
    ? `${K}.${FlattenObjectKeys<T[K]>}`
    : `${K}`
  : never;

export type Config = {
  timer: {
    time: Record<TimerName, number>;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomo: boolean;
  };
  sound: {
    alarm: {
      gain: number;
      sound: string;
    };
  };
  theme: {
    colorThemes: Record<TimerName, string>;
    hourFormat: '24' | '12';
  };
  others: {
    notification: {
      interval: number;
    };
  };
};
