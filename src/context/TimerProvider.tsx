import { TIMER_NAME } from '@constants';
import { useConfig } from '@hooks/useConfig';
import type { TimerName } from '@types';
import { padWithZeroes, playSound } from '@utils';
import type { ReactNode } from 'react';
import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { Config } from './ConfigProvider';

enum ActionTypes {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSE = 'PAUSE',
  CHANGE = 'CHANGE',
  REFRESH = 'Refresh',
}

export type TimerState = {
  seconds: number;
  time: Record<TimerName, number>;
  currentTimerName: TimerName;
  pomoDone: number;
  isPaused: boolean;
  isPlaying: boolean;
  longBreakInterval: number;
  autoStartPomo: boolean;
  autoStartBreaks: boolean;
};

type ChangeAction = {
  type: 'CHANGE';
  payload: TimerName;
};

type RefreshAction = {
  type: 'Refresh';
  payload: Config['timer'];
};

export type TimerAction =
  | ChangeAction
  | RefreshAction
  | { type: Exclude<ActionTypes, ActionTypes.CHANGE | ActionTypes.REFRESH> };

type PropsToOmit = 'time' | 'seconds' | 'longBreakInterval' | 'autoStartPomo' | 'autoStartBreaks';

type TimerContextType = Omit<TimerState, PropsToOmit> & {
  percentageValue: number;
  currentTime: string;
  startTimer(): void;
  pauseTimer(): void;
  changeCurrentTimer(tabName: TimerName): void;
};

function reducer(state: TimerState, action: TimerAction) {
  switch (action.type) {
    case ActionTypes.START: {
      return { ...state, isPlaying: true, isPaused: false, seconds: state.seconds };
    }

    case ActionTypes.PLAYING: {
      const isTimerFinished = state.seconds === state.time[state.currentTimerName];
      const isPomoFinished = isTimerFinished && state.currentTimerName === 'POMO';
      const isShortBreakFinished = isTimerFinished && state.currentTimerName === 'SHORT';
      const isLongBreakFinished = isTimerFinished && state.currentTimerName === 'LONG';
      const isLongBreak = (state.pomoDone + 1) % state.longBreakInterval === 0;

      const newState = {
        ...state,
        isPlaying: state.autoStartBreaks,
        seconds: 0,
        pomoDone: state.pomoDone + 1,
      };

      if (isPomoFinished) {
        playSound();
        return isLongBreak
          ? {
              ...newState,
              currentTimerName: TIMER_NAME.LONG,
            }
          : {
              ...newState,
              currentTimerName: TIMER_NAME.SHORT,
            };
      }

      if (isShortBreakFinished || isLongBreakFinished) {
        playSound();
        return {
          ...newState,
          currentTimerName: TIMER_NAME.POMO,
          isPlaying: state.autoStartPomo,
          pomoDone: state.pomoDone,
        };
      }

      return { ...state, seconds: state.seconds + 1 };
    }

    case ActionTypes.PAUSE: {
      return { ...state, isPaused: true, isPlaying: false };
    }

    case ActionTypes.CHANGE: {
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

    case ActionTypes.REFRESH: {
      const timer = action.payload;
      return { ...state, ...timer, seconds: 0, isPaused: false, isPlaying: false };
    }

    default: {
      throw new Error(`Unexpected action type: ${action.type}`);
    }
  }
}

export const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { timer } = useConfig();
  // Time is in Seconds
  const [state, dispatch] = useReducer(reducer, {
    seconds: 0,
    time: timer.time,
    currentTimerName: TIMER_NAME.POMO,
    pomoDone: 0,
    isPaused: false,
    isPlaying: false,
    longBreakInterval: timer.longBreakInterval,
    autoStartPomo: timer.autoStartPomo,
    autoStartBreaks: timer.autoStartBreaks,
  });

  const timeout = useRef(0);

  useEffect(() => {
    dispatch({ type: ActionTypes.REFRESH, payload: timer });
  }, [timer]);

  useEffect(() => {
    const ONE_SECOND = 1000;

    if (state.isPlaying) {
      timeout.current = setInterval(() => {
        dispatch({ type: ActionTypes.PLAYING });
      }, ONE_SECOND);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [state.isPlaying]);

  const startTimer = useCallback(() => {
    dispatch({ type: ActionTypes.START });
  }, [dispatch]);

  const pauseTimer = useCallback(() => {
    dispatch({ type: ActionTypes.PAUSE });
    clearTimeout(timeout.current);
  }, [dispatch]);

  const changeCurrentTimer = useCallback(
    (tabName: TimerName) => {
      dispatch({ type: ActionTypes.CHANGE, payload: tabName });
    },
    [dispatch],
  );

  const time = state.time[state.currentTimerName] - state.seconds;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const currentTime = `${padWithZeroes(minutes)}:${padWithZeroes(seconds)}`;
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
      percentageValue,
      currentTime,
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
