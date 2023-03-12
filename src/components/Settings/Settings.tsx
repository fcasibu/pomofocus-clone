import { Input, Toggle } from '@components';
import type { Config } from '@context';
import { configSchema } from '@context';
import { yupResolver } from '@hookform/resolvers/yup';
import { useConfig } from '@hooks/useConfig';
import { useModal } from '@hooks/useModal';
import { colors, spacing, zSettingsBackdrop, zSettingsModal } from '@utils';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import FocusLock from 'react-focus-lock';
import { useForm } from 'react-hook-form';
import { FaRegClock } from 'react-icons/fa';
import { VscClose } from 'react-icons/vsc';
import styled from 'styled-components';

const S = {
  Backdrop: styled.div`
    background-color: hsl(0 0% 0% / 0.4);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: ${zSettingsBackdrop};
  `,

  Container: styled.div`
    background-color: ${colors.WHITE};
    border-radius: 5px;
    color: ${colors.BLACK};
    left: 50%;
    max-height: 600px;
    max-width: 400px;
    overflow-y: auto;
    padding: ${spacing.XS};
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    z-index: ${zSettingsModal};
  `,

  Control: styled.div`
    span,
    label {
      display: inline-block;
      font-size: 14px;
      font-weight: 700;
      user-select: none;
    }

    > *:not(:last-child) {
      margin-bottom: ${spacing.S};
    }
  `,

  Footer: styled.div`
    background-color: ${colors.TRANSPARENT_BLACK};
    margin: 0 -${spacing.XS} -${spacing.XS};
    padding: ${spacing.XXXS} ${spacing.XS};

    > button {
      /* TODO: Reusable  button component */
      all: unset;
      background-color: ${colors.BLACK};
      border-radius: 4px;
      color: ${colors.WHITE};
      cursor: pointer;
      display: block;
      font-size: 12px;
      margin-left: auto;
      min-width: 42px;
      opacity: 0.8;
      padding: ${spacing.XXS};
      text-align: center;
      text-transform: uppercase;

      &:hover {
        opacity: 0.9;
      }

      &:focus-visible {
        outline: auto;
      }

      &:disabled {
        background-color: ${colors.LIGHTER_GREY};
        color: ${colors.BLACK};
        cursor: unset;
        opacity: 1;
      }
    }
  `,

  Header: styled.div`
    align-items: center;
    border-bottom: 1px solid ${colors.TRANSPARENT_BLACK};
    color: ${colors.LIGHT_GREY};
    display: flex;
    gap: ${spacing.XXS};
    justify-content: space-between;
    margin: 0 -${spacing.XS};
    padding-bottom: ${spacing.XXS};

    > h2 {
      font-size: 14px;
      font-weight: 700;
      margin: 0 ${spacing.XS};
    }

    > button {
      all: unset;
      cursor: pointer;
      margin: 0 ${spacing.XS};

      &:focus-visible {
        outline: auto;
      }

      &:hover {
        color: ${colors.BLACK};
      }
    }
  `,

  Setting: styled.div`
    padding: ${spacing.M} 0;

    > *:not(:last-child) {
      margin-bottom: ${spacing.S};
    }
  `,

  SettingContainer: styled.div`
    align-items: center;
    display: flex;
    gap: ${spacing.XXS};
    justify-content: space-between;
  `,

  SettingsForm: styled.form`
    > *:not(:nth-last-child(-n + 2)) {
      border-bottom: 1px solid ${colors.TRANSPARENT_BLACK};
    }
  `,

  Title: styled.h3`
    color: ${colors.LIGHTER_GREY};
    display: flex;
    font-size: 14px;
    font-weight: 700;
    gap: ${spacing.XXXS};
    letter-spacing: 1px;
    text-transform: uppercase;
  `,
};

const modalRoot = document.getElementById('settings-modal-root') as HTMLDivElement;

function Setting({ title, children }: { title: string; children: ReactNode }) {
  return (
    <S.Setting>
      <S.Title>
        <FaRegClock />
        <span>{title}</span>
      </S.Title>
      <S.Control>{children}</S.Control>
    </S.Setting>
  );
}

export function Settings() {
  const { close } = useModal();
  const { configure, timer } = useConfig();
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    control,
  } = useForm<Config>({
    defaultValues: {
      timer: {
        time: {
          POMO: timer.time.POMO / 60,
          SHORT: timer.time.SHORT / 60,
          LONG: timer.time.LONG / 60,
        },
        longBreakInterval: timer.longBreakInterval,
        autoStartBreaks: timer.autoStartBreaks,
        autoStartPomo: timer.autoStartPomo,
      },
    },
    resolver: yupResolver(configSchema),
  });

  const onSubmit = (data: Config) => {
    if (!isDirty) {
      close();
      return;
    }

    configure(data);
    close();
  };

  const timerOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValueAs: (v: any) => (Math.round(v * 100) / 100) * 60,
  };

  return createPortal(
    <>
      <S.Backdrop onClick={close} />
      <FocusLock>
        <S.Container aria-labelledby="settings-modal-label" role="dialog" aria-modal="true">
          <S.Header>
            <h2 id="settings-modal-label">Settings</h2>
            <button type="button" onClick={close} aria-label="Close Settings">
              <VscClose size={20} />
            </button>
          </S.Header>
          <S.SettingsForm onSubmit={handleSubmit(onSubmit)}>
            <Setting title="Timer">
              <span>Time (minutes)</span>
              <S.SettingContainer>
                <Input
                  {...register('timer.time.POMO', timerOptions)}
                  label="Pomodoro"
                  id="settings-timer-pomodoro"
                  type="number"
                  step="any"
                />
                <Input
                  {...register('timer.time.SHORT', timerOptions)}
                  label="Short Break"
                  id="settings-timer-short"
                  type="number"
                  step="any"
                />
                <Input
                  {...register('timer.time.LONG', timerOptions)}
                  label="Long Break"
                  id="settings-timer-long"
                  type="number"
                  step="any"
                />
              </S.SettingContainer>
              <S.SettingContainer>
                <label htmlFor="settings-timer-autoStartPomo">Auto Start Pomodoros</label>
                <Toggle
                  control={control}
                  name="timer.autoStartPomo"
                  id="settings-timer-autoStartPomo"
                  label="Auto Start Pomodoros"
                />
              </S.SettingContainer>
              <S.SettingContainer>
                <label htmlFor="settings-timer-autoStartBreaks">Auto Start Breaks</label>
                <Toggle
                  control={control}
                  name="timer.autoStartBreaks"
                  id="settings-timer-autoStartBreaks"
                  label="Auto Start Breaks"
                />
              </S.SettingContainer>
              <S.SettingContainer>
                <label htmlFor="settings-timer-longBreakInterval">Long Break Interval</label>
                <Input
                  {...register('timer.longBreakInterval', {
                    valueAsNumber: true,
                  })}
                  id="settings-timer-longBreakInterval"
                  type="number"
                  step="1"
                />
              </S.SettingContainer>
            </Setting>
            <Setting title="LOL">LOl</Setting>
            <S.Footer>
              <button type="submit" disabled={!isValid}>
                Ok
              </button>
            </S.Footer>
          </S.SettingsForm>
        </S.Container>
      </FocusLock>
    </>,
    modalRoot,
  );
}

export default Settings;
