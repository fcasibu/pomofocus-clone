import type { TimerName } from '@types';
import { colors } from '@utils';

export type Config = {
  timer: {
    time: Record<TimerName, number>;
    longBreakInterval: number;
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

    setTimeOption(time: Config['timer']['time']) {
      configuration.timer.time = time;
      localStorage.setItem(KEY, JSON.stringify(this));
    },

    setLongBreakIntervalOption(interval: number) {
      configuration.timer.longBreakInterval = interval;
      localStorage.setItem(KEY, JSON.stringify(this));
    },

    setColorThemeOption(themes: Config['theme']['colorThemes']) {
      configuration.theme.colorThemes = themes;
      localStorage.setItem(KEY, JSON.stringify(this));
    },

    setHourFormatOption(format: 24 | 12) {
      configuration.theme.hourFormat = format;
      localStorage.setItem(KEY, JSON.stringify(this));
    },

    setNotificationIntervalOption(interval: number) {
      configuration.others.notification.interval = interval;
      localStorage.setItem(KEY, JSON.stringify(this));
    },
  } as const;
})();
