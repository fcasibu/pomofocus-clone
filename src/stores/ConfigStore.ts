import { Alarm_Analog } from '@assets';
import { KEY } from '@constants';
import type { Config, FlattenObjectKeys } from '@types';
import { colors } from '@utils';
import type { Immutable } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ConfigKeys = FlattenObjectKeys<Config>;

type Actions = {
  updateTimer(newTimer: Config['timer']): void;
  updateSound(newSound: Config['sound']): void;
  updateTheme(newTheme: Config['theme']): void;
  updateOthers(newOthers: Config['others']): void;
  configure(newConfig: Config): void;
};

let initialState: Config = {
  timer: {
    time: { POMO: 1500, SHORT: 300, LONG: 900 },
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomo: false,
  },
  sound: {
    alarm: {
      gain: 0.5,
      sound: Alarm_Analog,
    },
  },
  theme: {
    colorThemes: {
      POMO: colors.RED,
      SHORT: colors.TEAL,
      LONG: colors.LIGHT_BLUE,
    },
    hourFormat: '12',
  },
  others: {
    notification: {
      interval: 1,
      type: 'last',
    },
  },
};

// TODO: Supabase
try {
  initialState =
    JSON.parse(localStorage.getItem(KEY) as string) ?? initialState;
} catch {
  localStorage.setItem(KEY, JSON.stringify(initialState));
}

export const useConfigStore = create(
  immer<{ config: Immutable<Config> } & Actions>((set) => ({
    config: initialState,
    updateTimer: (newTimer: Config['timer']) =>
      set((state) => {
        state.config.timer = newTimer;
      }),
    updateSound: (newSound: Config['sound']) =>
      set((state) => {
        state.config.sound = newSound;
      }),
    updateTheme: (newTheme: Config['theme']) =>
      set((state) => {
        state.config.theme = newTheme;
      }),
    updateOthers: (newOthers: Config['others']) =>
      set((state) => {
        state.config.others = newOthers;
      }),
    configure: (newConfig: Config) =>
      set((state) => {
        state.config = newConfig;
      }),
  })),
);
