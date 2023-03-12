import type { FlattenKeys, TimerName } from '@types';
import { colors } from '@utils';
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
});

export type Config = {
  timer: {
    time: Record<TimerName, number>;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomo: boolean;
  };
  theme: {
    colorThemes: Record<TimerName, string>;
    hourFormat: 24 | 12;
  };
  others: {
    notification: {
      interval: number;
    };
  };
};

export type ConfigKeys = FlattenKeys<Config>;

type ConfigContextType = Config & {
  configure(newConfig: Config): void;
};

export const ConfigContext = createContext<ConfigContextType | null>(null);

const KEY = 'pomofocus-config';

const initialState: Config = {
  timer: {
    time: { POMO: 1500, SHORT: 300, LONG: 900 },
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomo: false,
  },
  theme: {
    colorThemes: {
      POMO: colors.RED,
      SHORT: colors.TEAL,
      LONG: colors.LIGHT_BLUE,
    },
    hourFormat: 24,
  },
  others: {
    notification: {
      interval: 5,
    },
  },
};

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [{ timer, theme, others }, setConfig] = useState(() => {
    const configInStorage: Config | null = JSON.parse(localStorage.getItem(KEY) as string);

    if (configInStorage) {
      return configInStorage;
    }

    return initialState;
  });

  const configure = useCallback((newConfig: Config) => {
    setConfig({
      theme,
      others,
      timer: newConfig.timer,
    });

    localStorage.setItem(
      KEY,
      JSON.stringify({
        theme,
        others,
        timer: newConfig.timer,
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      timer,
      theme,
      others,
      configure,
    }),
    [timer, others, configure],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}
