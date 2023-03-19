import { TIMER_NAME } from '@constants';
import type { Config, TimerName } from '@types';
import { playAudio } from '@utils';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TimerState = {
  seconds: number;
  currentTimerName: TimerName;
  done: number;
  isPaused: boolean;
  isPlaying: boolean;
};

export type TimerActions = {
  startTimer(): void;
  pauseTimer(): void;
  forwardTimer(timer: Config['timer']): void;
  changeCurrentTimer(tabName: TimerName): void;
  play(config: Config): void;
  refresh(): void;
};

export const useTimerStore = create(
  immer<TimerState & TimerActions>((set) => ({
    seconds: 0,
    currentTimerName: TIMER_NAME.POMO,
    done: 0,
    isPaused: false,
    isPlaying: false,
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
        } else {
          state.isPlaying = autoStartPomo;
          state.currentTimerName = TIMER_NAME.POMO;
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
        const { sound, timer } = config;
        const isTimerFinished =
          state.seconds === timer.time[state.currentTimerName];
        const isPomoFinished =
          isTimerFinished && state.currentTimerName === TIMER_NAME.POMO;
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
          return state;
        }

        if (isShortBreakFinished || isLongBreakFinished) {
          playAudio(sound?.alarm.sound, sound?.alarm.gain);
          state.currentTimerName = TIMER_NAME.POMO;
          state.isPlaying = timer.autoStartPomo;
          state.seconds = 0;
          return state;
        }

        state.seconds++;
      }),
    refresh: () =>
      set((state) => {
        state.seconds = 0;
        state.isPlaying = false;
        state.isPaused = false;
      }),
  })),
);
