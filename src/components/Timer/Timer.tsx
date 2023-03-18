import { SEO } from '@components/common/';
import { useConfigStore, useTimerStore } from '@stores';
import type { TimerName } from '@types';
import { colors, media, padWithZeroes, spacing } from '@utils';
import { playAudio } from '@utils/playAudio';
import { useEffect, useRef } from 'react';
import { FaStepForward } from 'react-icons/fa';
import styled, { css } from 'styled-components';

type Tabs = {
  name: TimerName;
  short: string;
  long: string;
};

const S = {
  Button: styled.button<{ $isPlaying: boolean }>`
    all: unset;
    background-color: ${colors.WHITE};
    border-radius: 3px;
    box-shadow: inset 0 -6px ${colors.TRANSPARENT_BLACK};
    color: ${({ theme }) => theme.bg};
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    min-width: 120px;
    padding: ${spacing.S};
    text-align: center;
    text-transform: uppercase;

    &:focus-visible {
      outline: auto;
    }

    ${({ $isPlaying }) =>
      $isPlaying
        ? css`
            box-shadow: unset;
            transform: scaleY(0.94) translateY(2px);
          `
        : null}

    @media ${media.greaterThan('sm')} {
      font-size: 24px;
      min-width: 160px;
    }
  `,

  Container: styled.div`
    background-color: ${colors.TRANSPARENT_WHITE};
    border-radius: 3px;
    display: grid;
    gap: ${spacing.XL};
    margin: 0 auto ${spacing.XL};
    max-width: 480px;
    padding: ${spacing.S};
    place-items: center;
  `,

  ForwardButton: styled.button<{ $isPlaying: boolean }>`
    all: unset;
    cursor: pointer;
    opacity: ${({ $isPlaying }) => ($isPlaying ? 1 : 0)};
    position: absolute;
    right: ${spacing.XL};
    transition: opacity 0.3s;
    visibility: ${({ $isPlaying }) => ($isPlaying ? 'visible' : 'hidden')};

    &:focus-visible {
      outline: auto;
    }

    &:active {
      transform: scaleY(0.98) translateY(2px);
    }

    &:hover {
      opacity: ${({ $isPlaying }) => ($isPlaying ? 0.8 : 0)};
    }
  `,

  Tabs: styled.ul`
    align-items: center;
    display: flex;
    justify-content: center;
  `,

  Tab: styled.li<{ $isSelected: boolean }>`
    background-color: ${({ $isSelected }) => ($isSelected ? colors.TRANSPARENT_BLACK : 'none')};
    border-radius: 3px;
    cursor: pointer;

    &:active {
      transform: scaleY(0.98) translateY(2px);
    }

    > button {
      background: none;
      border: none;
      color: ${colors.WHITE};
      cursor: pointer;
      font-size: 16px;
      font-weight: ${({ $isSelected }) => ($isSelected ? '600' : 'unset')};
      padding: ${spacing.XXXS};
    }

    .tab-long {
      display: none;
    }

    @media ${media.greaterThan('sm')} {
      .tab-long {
        display: unset;
      }

      .tab-short {
        display: none;
      }
    }
  `,

  Time: styled.h2`
    font-size: 72px;
    font-weight: 700;

    @media ${media.greaterThan('lg')} {
      font-size: 102px;
    }
  `,

  Controls: styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
  `,
};

const tabs: Tabs[] = [
  {
    name: 'POMO',
    short: 'Pomo',
    long: 'Pomodoro',
  },
  {
    name: 'SHORT',
    short: 'Short',
    long: 'Short Break',
  },
  {
    name: 'LONG',
    short: 'Long',
    long: 'Long Break',
  },
];

export function Timer() {
  const timerActions = useTimerStore((state) => ({
    startTimer: state.startTimer,
    pauseTimer: state.pauseTimer,
    changeCurrentTimer: state.changeCurrentTimer,
    forwardTimer: state.forwardTimer,
    refresh: state.refresh,
    play: state.play,
  }));

  const timerState = useTimerStore((state) => ({
    seconds: state.seconds,
    isPlaying: state.isPlaying,
    currentTimerName: state.currentTimerName,
  }));

  const config = useConfigStore((state) => state.config);

  const timeout = useRef(0);

  useEffect(() => {
    const ONE_SECOND = 1000;

    if (timerState.isPlaying) {
      timeout.current = setInterval(() => {
        timerActions.play(config);
      }, ONE_SECOND);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [timerState.isPlaying, config.sound?.alarm?.gain, config.sound?.alarm?.sound]);

  useEffect(() => {
    timerActions.refresh();
  }, [config]);

  const handleTabChange = (tabName: TimerName) => () => {
    if (timerState.currentTimerName === tabName) return;
    timerActions.changeCurrentTimer(tabName);
  };

  const handleClick = () => {
    playAudio();
    if (timerState.isPlaying) {
      timerActions.pauseTimer();
      return;
    }

    timerActions.startTimer();
  };

  const time = config.timer.time[timerState.currentTimerName] - timerState.seconds;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const currentTime = `${padWithZeroes(minutes)}:${padWithZeroes(seconds)}`;
  const title =
    timerState.currentTimerName === 'POMO' ? `${currentTime} | Time to focus!` : `${currentTime} | Time for a break!`;

  return (
    <S.Container>
      <SEO
        title={title}
        description="Pomofocus is a Pomodoro app with a to-do list that helps you stay focused and get more done in less time. Try it now"
        url="https://fcasibu.github.io/pomofocus-clone"
        // TODO: change this to a better image
        ogImage="https://picsum.photos/536/354"
      />
      <header>
        <S.Tabs>
          {tabs.map(({ name, short, long }) => (
            <S.Tab key={name} $isSelected={name === timerState.currentTimerName}>
              <button type="button" onClick={handleTabChange(name)}>
                <span className="tab-short">{short}</span>
                <span className="tab-long">{long}</span>
              </button>
            </S.Tab>
          ))}
        </S.Tabs>
      </header>
      <S.Time>{currentTime}</S.Time>
      <S.Controls>
        <S.Button type="button" $isPlaying={timerState.isPlaying} onClick={handleClick}>
          {timerState.isPlaying ? 'Pause' : 'Start'}
        </S.Button>
        <S.ForwardButton
          type="button"
          $isPlaying={timerState.isPlaying}
          onClick={() => timerActions.forwardTimer(config.timer)}
          aria-label="Skip Forward"
        >
          <FaStepForward size={30} />
        </S.ForwardButton>
      </S.Controls>
    </S.Container>
  );
}

export default Timer;
