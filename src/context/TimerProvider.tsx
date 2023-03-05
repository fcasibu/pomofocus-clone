import { useSafeDispatch } from '@hooks';
import { Options } from '@options';
import { padWithZeroes } from '@utils';
import type { ReactNode } from 'react';
import { createContext, useCallback, useMemo, useReducer, useRef } from 'react';

const ACTION_TYPES = {
  START: 'START',
  PLAYING: 'PLAYING',
  PAUSE: 'PAUSE',
  CHANGE: 'CHANGE',
} as const;

const TIMER_NAME = {
  POMO: 'POMO',
  SHORT: 'SHORT',
  LONG: 'LONG',
} as const;

export type TimerState = {
  seconds: number;
  time: Record<keyof typeof TIMER_NAME, number>;
  currentTimerName: keyof typeof TIMER_NAME;
  pomoDone: number;
  isPaused: boolean;
  isPlaying: boolean;
};

export type TimerAction = { type: keyof typeof ACTION_TYPES; payload: keyof typeof TIMER_NAME };

type TimerContextType = Partial<TimerState> & {
  percentageValue: number;
  currentTime: string;
  startTimer(): void;
  pauseTimer(): void;
  changeCurrentTimer(tabName: keyof typeof TIMER_NAME): void;
};

const reducer = (state: TimerState, action: TimerAction) => {
  const { timer } = Options;

  switch (action.type) {
    case ACTION_TYPES.START: {
      return { ...state, isPlaying: true, isPaused: false, seconds: state.seconds };
    }

    case ACTION_TYPES.PLAYING: {
      const isPomoFinished = state.seconds === state.time.POMO && state.currentTimerName === TIMER_NAME.POMO;
      const isShortBreakFinished = state.seconds === state.time.SHORT && state.currentTimerName === TIMER_NAME.SHORT;
      const isLongBreakFinished = state.seconds === state.time.LONG && state.currentTimerName === TIMER_NAME.LONG;
      const isLongBreakIntervalFulfilled = state.pomoDone % timer.longBreakInterval === timer.longBreakInterval - 1;

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

      if (isShortBreakFinished || isLongBreakFinished) {
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
        currentTimerName: action.payload,
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

// TODO: Refactor getPercentageValue, getMinutes, and getSeconds
const getPercentageValue = (state: TimerState) => {
  switch (state.currentTimerName) {
    case TIMER_NAME.POMO: {
      return (state.seconds / state.time.POMO) * 100;
    }

    case TIMER_NAME.SHORT: {
      return (state.seconds / state.time.SHORT) * 100;
    }

    case TIMER_NAME.LONG: {
      return (state.seconds / state.time.LONG) * 100;
    }

    default: {
      throw new Error(`Unknown ${state.currentTimerName}`);
    }
  }
};

const getMinutes = (state: TimerState) => {
  const calculateMinutes = (name: keyof typeof TIMER_NAME) =>
    padWithZeroes(Math.floor((state.time[name] - state.seconds) / 60));

  switch (state.currentTimerName) {
    case TIMER_NAME.POMO: {
      return calculateMinutes(TIMER_NAME.POMO);
    }

    case TIMER_NAME.SHORT: {
      return calculateMinutes(TIMER_NAME.SHORT);
    }

    case TIMER_NAME.LONG: {
      return calculateMinutes(TIMER_NAME.LONG);
    }

    default: {
      throw new Error(`Unknown ${state.currentTimerName}`);
    }
  }
};

const getSeconds = (state: TimerState, minutes: string) => {
  const calculateSeconds = (name: keyof typeof TIMER_NAME) =>
    minutes !== '00'
      ? padWithZeroes(Math.abs((state.seconds % 60) - 60))
      : padWithZeroes(state.time[name] - state.seconds);

  switch (state.currentTimerName) {
    case TIMER_NAME.POMO: {
      return calculateSeconds(TIMER_NAME.POMO);
    }

    case TIMER_NAME.SHORT: {
      return calculateSeconds(TIMER_NAME.SHORT);
    }

    case TIMER_NAME.LONG: {
      return calculateSeconds(TIMER_NAME.LONG);
    }

    default: {
      throw new Error(`Unknown ${state.currentTimerName}`);
    }
  }
};

export function TimerProvider({ children }: { children: ReactNode }) {
  // Time is in Seconds
  const [state, unsafeDispatch] = useReducer(reducer, {
    seconds: 0,
    time: Options.timer.time,
    currentTimerName: TIMER_NAME.POMO,
    pomoDone: 0,
    isPaused: false,
    isPlaying: false,
  });
  const requestIDRef = useRef(0);

  const dispatch = useSafeDispatch(unsafeDispatch);

  if (!state.isPlaying) {
    cancelAnimationFrame(requestIDRef.current);
  }

  const animate = useCallback(
    (startTime: number) => (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= 1000) {
        dispatch({ type: 'PLAYING' });
        startTime = performance.now();
      }
      requestIDRef.current = requestAnimationFrame(animate(startTime));
    },
    [dispatch],
  );

  const startTimer = useCallback(() => {
    const startTime = performance.now();
    dispatch({ type: 'START' });
    requestIDRef.current = requestAnimationFrame(animate(startTime));
  }, [dispatch]);

  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE' });
    cancelAnimationFrame(requestIDRef.current);
  }, [dispatch]);

  const changeCurrentTimer = useCallback(
    (tabName: keyof typeof TIMER_NAME) => {
      dispatch({ type: 'CHANGE', payload: tabName });
    },
    [dispatch],
  );

  const { percentageValue, minutes, seconds } = useMemo(() => {
    const pv = getPercentageValue(state);
    const m = getMinutes(state);
    const s = getSeconds(state, m);

    return { percentageValue: pv, minutes: m, seconds: s };
  }, [state.currentTimerName, state.seconds]);

  const currentTime = seconds !== '60' ? `${minutes}:${seconds}` : `${minutes}:00`;

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
      minutes,
      seconds,
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
