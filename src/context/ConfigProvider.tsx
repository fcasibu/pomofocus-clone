import { Alarm_Analog } from '@assets';
import type { FlattenObjectKeys, TimerName } from '@types';
import { colors } from '@utils';
import produce from 'immer';
import type { ReactNode } from 'react';
import { createContext, useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';

export const configSchema = yup.object({
  timer: yup.object({
    time: yup
      .object({
        POMO: yup.number().min(0.1).required(),
        SHORT: yup.number().min(0.1).required(),
        LONG: yup.number().min(0.1).required(),
      })
      .required(),
    longBreakInterval: yup.number().min(1).required(),
    autoStartPomo: yup.boolean(),
    autoStartBreaks: yup.boolean(),
  }),
  sound: yup.object({
    alarm: yup.object({
      gain: yup.number().default(0.5),
      sound: yup.string().default(Alarm_Analog),
    }),
  }),
  theme: yup.object({
    colorThemes: yup.object({
      POMO: yup.string().default(colors.RED),
      SHORT: yup.string().default(colors.TEAL),
      LONG: yup.string().default(colors.LIGHT_BLUE),
    }),
    hourFormat: yup.string().default('12'),
  }),
});

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

export type ConfigKeys = FlattenObjectKeys<Config>;

interface ConfigContextType extends Config {
  updateTimer(newTimer: Config['timer']): void;
  updateSound(newSound: Config['sound']): void;
  updateTheme(newTheme: Config['theme']): void;
  updateOthers(newOthers: Config['others']): void;
  configure(newConfig: Config): void;
}

export const ConfigContext = createContext<ConfigContextType | null>(null);

const KEY = 'pomofocus-config';

export const initialState: Config = {
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
      interval: 5,
    },
  },
};

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [{ timer, theme, sound, others }, setConfig] = useState(() => {
    const configInStorage: Config | null = JSON.parse(localStorage.getItem(KEY) as string);

    if (configInStorage) {
      return configInStorage;
    }

    return initialState;
  });

  const updateTimer = useCallback((newTimer: Config['timer']) => {
    setConfig(
      produce((draft) => {
        draft.timer = newTimer;
      }),
    );
  }, []);

  const updateTheme = useCallback((newTheme: Config['theme']) => {
    setConfig(
      produce((draft) => {
        draft.theme = newTheme;
      }),
    );
  }, []);

  const updateSound = useCallback((newSound: Config['sound']) => {
    setConfig(
      produce((draft) => {
        draft.sound = newSound;
      }),
    );
  }, []);

  const updateOthers = useCallback((newOthers: Config['others']) => {
    setConfig(
      produce((draft) => {
        draft.others = newOthers;
      }),
    );
  }, []);

  const configure = useCallback((newConfig: Config) => {
    setConfig(newConfig);

    localStorage.setItem(KEY, JSON.stringify(newConfig));
  }, []);

  const value = useMemo(
    () => ({
      others,
      sound,
      timer,
      theme,
      updateTimer,
      updateTheme,
      updateSound,
      updateOthers,
      configure,
    }),
    [timer, others, sound, updateTimer, updateTheme, updateSound, updateOthers, configure],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}
