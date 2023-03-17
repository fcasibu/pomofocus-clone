import type { TIMER_NAME } from '../constants';

export type TimerName = keyof typeof TIMER_NAME;

// Credits to: https://www.raygesualdo.com/posts/flattening-object-keys-with-typescript-types
export type FlattenObjectKeys<T extends Record<string, unknown>, K = keyof T> = K extends string
  ? T[K] extends Record<string, unknown>
    ? `${K}.${FlattenObjectKeys<T[K]>}`
    : `${K}`
  : never;
