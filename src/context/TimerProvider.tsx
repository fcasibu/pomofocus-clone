import { TIMER_NAME } from '@constants';
import { useConfig } from '@hooks/useConfig';
import type { TimerName } from '@types';
import { padWithZeroes, playAudio } from '@utils';
import produce from 'immer';
import type { ReactNode } from 'react';
import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { Config } from './ConfigProvider';

enum ActionTypes {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSE = 'PAUSE',
  FORWARD = 'FORWARD',
  CHANGE = 'CHANGE',
  REFRESH = 'REFRESH',
}

export type TimerState = {
  seconds: number;
  currentTimerName: TimerName;
  pomoDone: number;
  isPaused: boolean;
  isPlaying: boolean;
};

type ChangeAction = {
  type: 'CHANGE';
  payload: TimerName;
};

type PlayingAction = {
  type: 'PLAYING';
  payload: Omit<Config, 'theme' | 'others'>;
};

type ForwardAction = {
  type: 'FORWARD';
  payload: Config['timer'];
};

type ActionsToExclude = ActionTypes.CHANGE | ActionTypes.PLAYING | ActionTypes.FORWARD;

export type TimerAction =
  | ChangeAction
  | PlayingAction
  | ForwardAction
  | { type: Exclude<ActionTypes, ActionsToExclude> };

type TimerContextType = Omit<TimerState, 'seconds'> & {
  percentageValue: number;
  currentTime: string;
  startTimer(): void;
  pauseTimer(): void;
  forwardTimer(): void;
  changeCurrentTimer(tabName: TimerName): void;
};

const reducer = produce((state: TimerState, action: TimerAction) => {
  switch (action.type) {
    case ActionTypes.START: {
      state.isPlaying = true;
      state.isPaused = false;
      break;
    }

    case ActionTypes.PLAYING: {
      const { sound, timer } = action.payload;
      const isTimerFinished = state.seconds === timer.time[state.currentTimerName];
      const isPomoFinished = isTimerFinished && state.currentTimerName === TIMER_NAME.POMO;
      const isShortBreakFinished = isTimerFinished && state.currentTimerName === TIMER_NAME.SHORT;
      const isLongBreakFinished = isTimerFinished && state.currentTimerName === TIMER_NAME.LONG;
      const isLongBreak = (state.pomoDone + 1) % timer.longBreakInterval === 0;

      if (isPomoFinished) {
        playAudio(sound.alarm.sound, sound.alarm.gain);
        state.seconds = 0;
        state.isPlaying = timer.autoStartBreaks;
        state.currentTimerName = isLongBreak ? TIMER_NAME.LONG : TIMER_NAME.SHORT;
        state.pomoDone++;
        break;
      }

      if (isShortBreakFinished || isLongBreakFinished) {
        playAudio(sound?.alarm.sound, sound?.alarm.gain);
        state.currentTimerName = TIMER_NAME.POMO;
        state.isPlaying = timer.autoStartPomo;
        state.seconds = 0;
        break;
      }

      state.seconds++;
      break;
    }

    case ActionTypes.PAUSE: {
      state.isPaused = true;
      state.isPlaying = false;
      break;
    }

    case ActionTypes.CHANGE: {
      if (state.isPlaying) {
        const isOK = confirm('Timer is current playing are you sure?');

        if (!isOK) {
          state.isPlaying = false;
          break;
        }
      }

      state.currentTimerName = action.payload;
      state.seconds = 0;
      state.isPaused = false;
      state.isPlaying = false;
      break;
    }

    case ActionTypes.REFRESH: {
      state.seconds = 0;
      state.isPlaying = false;
      state.isPaused = false;
      break;
    }

    case ActionTypes.FORWARD: {
      const { longBreakInterval, autoStartBreaks, autoStartPomo } = action.payload;
      const isLongBreak = (state.pomoDone + 1) % longBreakInterval === 0;
      state.seconds = 0;

      if (state.currentTimerName === TIMER_NAME.POMO) {
        state.pomoDone++;
        state.isPlaying = autoStartBreaks;
        state.currentTimerName = isLongBreak ? TIMER_NAME.LONG : TIMER_NAME.SHORT;
      } else {
        state.isPlaying = autoStartPomo;
        state.currentTimerName = TIMER_NAME.POMO;
      }

      break;
    }

    default: {
      throw new Error(`Unexpected action type: ${action.type}`);
    }
  }
});

export const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { timer, sound, others, theme } = useConfig();
  // Time is in Seconds
  const [state, dispatch] = useReducer(reducer, {
    seconds: 0,
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
        dispatch({ type: ActionTypes.PLAYING, payload: { timer, sound } });
      }, ONE_SECOND);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [state.isPlaying, sound?.alarm?.gain, sound?.alarm?.sound]);

  useEffect(() => {
    dispatch({ type: ActionTypes.REFRESH });
  }, [timer, sound, others, theme]);

  const startTimer = useCallback(() => {
    dispatch({ type: ActionTypes.START });
  }, [dispatch]);

  const pauseTimer = useCallback(() => {
    dispatch({ type: ActionTypes.PAUSE });
    clearTimeout(timeout.current);
  }, [dispatch]);

  const forwardTimer = useCallback(() => {
    dispatch({ type: ActionTypes.FORWARD, payload: timer });
  }, [dispatch, timer]);

  const changeCurrentTimer = useCallback(
    (tabName: TimerName) => {
      dispatch({ type: ActionTypes.CHANGE, payload: tabName });
    },
    [dispatch],
  );

  const time = timer.time[state.currentTimerName] - state.seconds;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const currentTime = `${padWithZeroes(minutes)}:${padWithZeroes(seconds)}`;
  const percentageValue = (state.seconds / timer.time[state.currentTimerName]) * 100;

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
      forwardTimer,
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
      forwardTimer,
      changeCurrentTimer,
    ],
  );

  return <TimerContext.Provider value={values}>{children}</TimerContext.Provider>;
}
