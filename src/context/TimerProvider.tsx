import { TIMER_NAME } from '@constants';
import { Options } from '@options';
import type { TimerName } from '@types';
import { padWithZeroes } from '@utils';
import type { ReactNode } from 'react';
import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

const ACTION_TYPES = {
  START: 'START',
  PLAYING: 'PLAYING',
  PAUSE: 'PAUSE',
  CHANGE: 'CHANGE',
} as const;

export type TimerState = {
  seconds: number;
  time: Record<TimerName, number>;
  currentTimerName: TimerName;
  pomoDone: number;
  isPaused: boolean;
  isPlaying: boolean;
};

export type TimerAction = { type: keyof typeof ACTION_TYPES; payload?: TimerName };

type TimerContextType = Omit<TimerState, 'time' | 'seconds'> & {
  percentageValue: number;
  currentTime: string;
  startTimer(): void;
  pauseTimer(): void;
  changeCurrentTimer(tabName: TimerName): void;
};

const reducer = (state: TimerState, action: TimerAction) => {
  const { timer } = Options;

  switch (action.type) {
    case ACTION_TYPES.START: {
      return { ...state, isPlaying: true, isPaused: false, seconds: state.seconds };
    }

    case ACTION_TYPES.PLAYING: {
      const isPomoFinished = state.seconds === state.time.POMO;
      const isBreakFinished = state.seconds === state.time[state.currentTimerName];
      const isLongBreakIntervalFulfilled = (state.pomoDone + 1) % timer.longBreakInterval === 0;

      if (isPomoFinished && isLongBreakIntervalFulfilled) {
        return {
          ...state,
          currentTimerName: TIMER_NAME.LONG,
          isPlaying: false,
          seconds: 0,
          pomoDone: state.pomoDone + 1,
        };
      }

      if (isPomoFinished) {
        return {
          ...state,
          currentTimerName: TIMER_NAME.SHORT,
          isPlaying: false,
          seconds: 0,
          pomoDone: state.pomoDone + 1,
        };
      }

      if (isBreakFinished) {
        return { ...state, currentTimerName: TIMER_NAME.POMO, isPlaying: false, seconds: 0 };
      }

      return { ...state, seconds: state.seconds + 1 };
    }

    case ACTION_TYPES.PAUSE: {
      return { ...state, isPaused: true, isPlaying: false };
    }

    case ACTION_TYPES.CHANGE: {
      if (state.isPlaying) {
        const isOK = confirm('Timer is current playing are you sure?');

        if (!isOK) {
          return { ...state, isPlaying: false };
        }
      }
      return {
        ...state,
        currentTimerName: action.payload as TimerName,
        seconds: 0,
        isPaused: false,
        isPlaying: false,
      };
    }

    default: {
      throw new Error(`Unexpected action type: ${action.type}`);
    }
  }
};

export const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  // Time is in Seconds
  const [state, dispatch] = useReducer(reducer, {
    seconds: 0,
    time: Options.timer.time,
    currentTimerName: TIMER_NAME.POMO,
    pomoDone: 0,
    isPaused: false,
    isPlaying: false,
  });
  const timeout = useRef(0);

  useEffect(() => {
    const ONE_SECOND = 1000;

    if (state.isPlaying) {
      timeout.current = setInterval(() => {
        dispatch({ type: 'PLAYING' });
      }, ONE_SECOND);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [state.isPlaying]);

  const startTimer = useCallback(() => {
    dispatch({ type: 'START' });
  }, [dispatch]);

  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE' });
    clearTimeout(timeout.current);
  }, [dispatch]);

  const changeCurrentTimer = useCallback(
    (tabName: TimerName) => {
      dispatch({ type: 'CHANGE', payload: tabName });
    },
    [dispatch],
  );

  const currentTime = useMemo(() => {
    const minutes = padWithZeroes(Math.floor((state.time[state.currentTimerName] - state.seconds) / 60));
    const seconds =
      minutes !== '00'
        ? padWithZeroes(Math.abs((state.seconds % 60) - 60))
        : padWithZeroes(state.time[state.currentTimerName] - state.seconds);

    return seconds !== '60' ? `${minutes}:${seconds}` : `${minutes}:00`;
  }, [state.currentTimerName, state.seconds]);

  const percentageValue = (state.seconds / state.time[state.currentTimerName]) * 100;

  const values = useMemo(
    () => ({
      currentTimerName: state.currentTimerName,
      pomoDone: state.pomoDone,
      isPaused: state.isPaused,
      isPlaying: state.isPlaying,
      currentTime,
      percentageValue,
      startTimer,
      pauseTimer,
      changeCurrentTimer,
    }),
    [
      currentTime,
      percentageValue,
      state.currentTimerName,
      state.pomoDone,
      state.isPaused,
      state.isPlaying,
      startTimer,
      pauseTimer,
      changeCurrentTimer,
    ],
  );

  return <TimerContext.Provider value={values}>{children}</TimerContext.Provider>;
}
