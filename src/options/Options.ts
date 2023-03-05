import { colors } from '@utils';

// abstract later
const TIMER_NAME = {
  POMO: 'POMO',
  SHORT: 'SHORT',
  LONG: 'LONG',
} as const;

export type Config = {
  timer: {
    time: Record<keyof typeof TIMER_NAME, number>;
    longBreakInterval: number;
  };
  theme: {
    colorThemes: Record<keyof typeof TIMER_NAME, string>;
    hourFormat: 24 | 12;
  };
  others: {
    notification: {
      interval: number;
    };
  };
};

export const Options = (function () {
  const KEY = 'pomofocus-config';
  const configInStorage: Config | null = JSON.parse(localStorage.getItem(KEY) as string);

  const configuration: Config = configInStorage ?? {
    timer: {
      time: { POMO: 5, SHORT: 2, LONG: 3 },
      longBreakInterval: 2,
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

  return {
    get timer() {
      return configuration.timer;
    },

    get theme() {
      return configuration.theme;
    },

    get others() {
      return configuration.others;
    },

    setTimerTime(time: Record<keyof typeof TIMER_NAME, number>) {
      configuration.timer.time = time;
      localStorage.setItem(KEY, JSON.stringify(this));
    },

    setTimerLongBreakInterval(interval: number) {
      configuration.timer.longBreakInterval = interval;
      localStorage.setItem(KEY, JSON.stringify(this));
    },

    setThemeColorThemes(themes: Record<keyof typeof TIMER_NAME, string>) {
      configuration.theme.colorThemes = themes;
      localStorage.setItem(KEY, JSON.stringify(this));
    },

    setHourFormat(format: 24 | 12) {
      configuration.theme.hourFormat = format;
      localStorage.setItem(KEY, JSON.stringify(this));
    },

    setOthersNotification(interval: number) {
      configuration.others.notification.interval = interval;
      localStorage.setItem(KEY, JSON.stringify(this));
    },
  } as const;
})();
