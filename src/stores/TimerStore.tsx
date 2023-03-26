import { TIMER_KEY, TIMER_NAME } from '@constants';
import type { Config, TimerName } from '@types';
import { notify, playAudio } from '@utils';
import type { Immutable } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TimerState = Immutable<{
  seconds: number;
  currentTimerName: TimerName;
  done: number;
  isPaused: boolean;
  isPlaying: boolean;
}>;

export type TimerActions = {
  startTimer(): void;
  pauseTimer(): void;
  forwardTimer(timer: Config['timer']): void;
  changeCurrentTimer(tabName: TimerName): void;
  play(config: Config): void;
  refresh(): void;
  reset(): void;
};

let initialState: TimerState = {
  seconds: 0,
  currentTimerName: TIMER_NAME.POMO,
  done: 0,
  isPaused: false,
  isPlaying: false,
};

// TODO: Firebase
try {
  initialState =
    JSON.parse(localStorage.getItem(TIMER_KEY) as string) ?? initialState;
} catch {
  localStorage.setItem(TIMER_KEY, JSON.stringify(initialState));
}

export const useTimerStore = create(
  immer<TimerState & TimerActions>((set, get) => ({
    ...initialState,
    startTimer: () =>
      set((state) => {
        state.isPlaying = true;
        state.isPaused = false;
      }),
    pauseTimer: () =>
      set((state) => {
        state.isPlaying = false;
        state.isPaused = true;
      }),
    forwardTimer: (timer: Config['timer']) =>
      set((state) => {
        const { longBreakInterval, autoStartBreaks, autoStartPomo } = timer;
        const isLongBreak = (state.done + 1) % longBreakInterval === 0;
        state.seconds = 0;

        if (state.currentTimerName === TIMER_NAME.POMO) {
          state.done++;
          state.isPlaying = autoStartBreaks;
          state.currentTimerName = isLongBreak
            ? TIMER_NAME.LONG
            : TIMER_NAME.SHORT;

          notify(`Time for a ${isLongBreak ? 'long' : 'short'} break`);
        } else {
          state.isPlaying = autoStartPomo;
          state.currentTimerName = TIMER_NAME.POMO;

          notify('Time to focus');
        }
      }),
    changeCurrentTimer: (tabName: TimerName) =>
      set((state) => {
        if (state.isPlaying) {
          const isOK = confirm('Timer is current playing are you sure?');

          if (!isOK) {
            state.isPlaying = false;
            return state;
          }
        }

        state.currentTimerName = tabName;
        state.seconds = 0;
        state.isPaused = false;
        state.isPlaying = false;
      }),
    play: (config: Config) =>
      set((state) => {
        const { sound, timer, others } = config;
        const isTimerFinished =
          state.seconds === timer.time[state.currentTimerName];
        const isPomoTimer = state.currentTimerName === TIMER_NAME.POMO;
        const isPomoFinished = isTimerFinished && isPomoTimer;
        const isShortBreakFinished =
          isTimerFinished && state.currentTimerName === TIMER_NAME.SHORT;
        const isLongBreakFinished =
          isTimerFinished && state.currentTimerName === TIMER_NAME.LONG;
        const isLongBreak = (state.done + 1) % timer.longBreakInterval === 0;

        if (isPomoFinished) {
          playAudio(sound.alarm.sound, sound.alarm.gain);
          state.seconds = 0;
          state.isPlaying = timer.autoStartBreaks;
          state.currentTimerName = isLongBreak
            ? TIMER_NAME.LONG
            : TIMER_NAME.SHORT;
          state.done++;
          notify(`Time for a ${isLongBreak ? 'long' : 'short'} break!`);

          return state;
        }

        if (isShortBreakFinished || isLongBreakFinished) {
          playAudio(sound?.alarm.sound, sound?.alarm.gain);
          state.currentTimerName = TIMER_NAME.POMO;
          state.isPlaying = timer.autoStartPomo;
          state.seconds = 0;
          notify(`Time to focus!`);
          return state;
        }

        state.seconds += 1;

        const isAMinuteLeft =
          state.seconds === timer.time[state.currentTimerName] - 60;
        const notificationIntervalInSeconds = others.notification.interval * 60;
        const timeRemaining = timer.time.POMO - state.seconds;
        const isEveryNotificationType = others.notification.type === 'every';

        if (isEveryNotificationType && isPomoTimer) {
          if (
            timeRemaining % notificationIntervalInSeconds === 0 &&
            timeRemaining !== 0
          ) {
            notify(
              `You have ${timeRemaining / 60} ${
                isAMinuteLeft ? 'minute' : 'minutes'
              } left`,
            );
          }
        } else if (
          timeRemaining === notificationIntervalInSeconds &&
          isPomoTimer
        ) {
          notify(
            `You have ${notificationIntervalInSeconds / 60} ${
              isAMinuteLeft ? 'minute' : 'minutes'
            } left`,
          );
        }
      }),
    refresh: () =>
      set((state) => {
        state.seconds = 0;
        state.isPlaying = false;
        state.isPaused = false;
      }),
    reset: () =>
      set((state) => {
        get().refresh();
        state.done = 0;
      }),
  })),
);
