import type { ReactNode } from 'react';
import { useLayoutEffect, useReducer, createContext, useMemo } from 'react';

const ACTION_TYPES = {
  START: 'START',
  PLAYING: 'PLAYING',
  BREAK: 'BREAK',
  PAUSE: 'PAUSE',
  NEXT: 'NEXT',
} as const;

const DEFAULT_END_TIME = 2500;
const DEFAULT_BREAK_TIME = 500;

export type TimerState = {
  currentTime: number;
  endTime: number;
  breakTime: number;
  pomoDone: number;
  isPaused: boolean;
  isStopped: boolean;
  isNext: boolean;
  isStarted: boolean;
  isBreak: boolean;
};

export type TimerAction = TimerState & { type: keyof typeof ACTION_TYPES };

type TimerContextType = {
  percentageValue: number;
  timerStart(endTime: number): void;
  timerPause(): void;
  timerNext(): void;
  timerBreak(breakTime: number): void;
};

const reducer = (state: TimerState, action: TimerAction) => {
  const { currentTime, endTime, pomoDone = 0 } = state;
  switch (action.type) {
    case ACTION_TYPES.START: {
      return {
        currentTime: 0,
        endTime: action.endTime,
        breakTime: state.breakTime,
        pomoDone: pomoDone,
        isPaused: false,
        isStopped: false,
        isNext: false,
        isStarted: true,
        isBreak: false,
      };
    }
    case ACTION_TYPES.PLAYING: {
      if (state.currentTime === state.endTime || (state.isBreak && state.currentTime === state.breakTime)) {
        return {
          ...state,
          isBreak: !state.isBreak,
        };
      }
      return {
        currentTime: state.currentTime + 1,
        endTime: endTime,
        breakTime: state.breakTime,
        pomoDone: pomoDone,
        isPaused: false,
        isStopped: false,
        isNext: false,
        isStarted: true,
        isBreak: state.isBreak,
      };
    }
    case ACTION_TYPES.BREAK: {
      return {
        currentTime: 0,
        endTime: endTime,
        breakTime: action.breakTime,
        pomoDone: pomoDone,
        isPaused: false,
        isStopped: false,
        isNext: false,
        isStarted: false,
        isBreak: true,
      };
    }
    case ACTION_TYPES.PAUSE: {
      return {
        currentTime: currentTime,
        endTime: endTime,
        breakTime: state.breakTime,
        pomoDone: pomoDone,
        isPaused: true,
        isStopped: false,
        isNext: false,
        isStarted: true,
        isBreak: false,
      };
    }
    case ACTION_TYPES.NEXT: {
      return {
        currentTime: 0,
        endTime: endTime,
        breakTime: state.breakTime,
        pomoDone: pomoDone + 1,
        isPaused: false,
        isStopped: false,
        isNext: true,
        isStarted: false,
        isBreak: false,
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
    currentTime: 0,
    endTime: DEFAULT_END_TIME,
    breakTime: DEFAULT_BREAK_TIME,
    pomoDone: 0,
    isPaused: false,
    isStopped: false,
    isNext: false,
    isStarted: false,
    isBreak: false,
  });

  useLayoutEffect(() => {
    const ONE_SECOND = 1000;
    let timeout: number;

    if (state.isStarted) {
      timeout = setInterval(() => {
        dispatch({ ...state, type: 'PLAYING' });
      }, ONE_SECOND);
    }

    if (state.isBreak) {
      dispatch({ ...state, type: 'BREAK' });
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [state.isStarted, state.isBreak]);

  const timerStart = (endTime: number) => {
    dispatch({ ...state, type: 'START', endTime });
  };

  const timerPause = () => {
    dispatch({ ...state, type: 'PAUSE' });
  };

  const timerBreak = (breakTime: number) => {
    dispatch({ ...state, type: 'BREAK', breakTime });
  };

  const timerNext = () => {
    dispatch({ ...state, type: 'NEXT' });
  };

  const percentageValue = Math.ceil((state.currentTime / state.endTime) * 100);

  const values = useMemo(() => ({ percentageValue, timerStart, timerPause, timerBreak, timerNext }), [percentageValue]);

  return <TimerContext.Provider value={values}>{children}</TimerContext.Provider>;
}
