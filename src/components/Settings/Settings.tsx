import { Alarm_Analog, Alarm_Bell_1, Alarm_Bell_2 } from '@assets';
import { ColorSwitcher, Input, Range, Select, Toggle } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { configSchema } from '@schemas';
import { useConfigStore, useModalStore, useTimerStore } from '@stores';
import type { Config } from '@types';
import {
  colors,
  ModalContainer,
  ModalFooter,
  ModalHeader,
  spacing,
} from '@utils';
import type { ReactNode } from 'react';
import FocusLock from 'react-focus-lock';
import { useForm } from 'react-hook-form';
import { FaRegClock } from 'react-icons/fa';
import { VscClose } from 'react-icons/vsc';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';

const S = {
  Container: styled.div`
    ${ModalContainer}
    max-height: 600px;
    max-width: 400px;
    overflow-y: scroll;
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
    ${ModalFooter}

    > button {
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
    ${ModalHeader}
  `,

  NotificationContainer: styled.div`
    align-items: center;
    display: flex;
    gap: ${spacing.XXXS};

    > *:not(:last-child) {
      max-width: 75px;
    }
  `,

  Row: styled.div`
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    gap: ${spacing.XS};
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
  const close = useModalStore((state) => state.close);
  const { configure, timer, config } = useConfigStore(
    (state) => ({
      configure: state.configure,
      timer: state.config.timer,
      config: state.config,
    }),
    shallow,
  );
  const refresh = useTimerStore((state) => state.refresh);

  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty },
    control,
  } = useForm<Config>({
    defaultValues: {
      ...config,
      timer: {
        ...timer,
        time: {
          POMO: timer.time.POMO / 60,
          SHORT: timer.time.SHORT / 60,
          LONG: timer.time.LONG / 60,
        },
      },
    },
    resolver: yupResolver(configSchema),
  });

  const onSubmit = (newConfig: Config) => {
    if (!isDirty) {
      close();
      return;
    }

    configure(newConfig);
    refresh();
    close();
  };

  const timerOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValueAs: (v: any) => (Math.round(v * 100) / 100) * 60,
  };

  return (
    <FocusLock>
      <S.Container
        aria-labelledby="settings-modal-label"
        role="dialog"
        aria-modal="true"
      >
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
              <label htmlFor="settings-timer-autoStartPomo">
                Auto Start Pomodoros
              </label>
              <Toggle
                control={control}
                name="timer.autoStartPomo"
                id="settings-timer-autoStartPomo"
                label="Auto Start Pomodoros"
              />
            </S.SettingContainer>
            <S.SettingContainer>
              <label htmlFor="settings-timer-autoStartBreaks">
                Auto Start Breaks
              </label>
              <Toggle
                control={control}
                name="timer.autoStartBreaks"
                id="settings-timer-autoStartBreaks"
                label="Auto Start Breaks"
              />
            </S.SettingContainer>
            <S.SettingContainer>
              <label htmlFor="settings-timer-longBreakInterval">
                Long Break Interval
              </label>
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
          <Setting title="Sound">
            <S.SettingContainer>
              <label htmlFor="settings-sound-alarmSound">Alarm Sound</label>
              <S.Row>
                <Select
                  control={control}
                  name="sound.alarm.sound"
                  id="settings-sound-alarmSound"
                  label="Alarm Sound"
                  isAudio
                >
                  {/* TODO: Refactor */}
                  {[
                    {
                      soundName: 'Analog',
                      value: Alarm_Analog,
                    },
                    {
                      soundName: 'Bell 1',
                      value: Alarm_Bell_1,
                    },
                    {
                      soundName: 'Bell 2',
                      value: Alarm_Bell_2,
                    },
                  ].map(({ value, soundName }, index) => (
                    <option key={`${soundName}-${index}`} value={value}>
                      {soundName}
                    </option>
                  ))}
                </Select>
                <Range
                  control={control}
                  name="sound.alarm.gain"
                  label="Alarm Sound"
                />
              </S.Row>
            </S.SettingContainer>
          </Setting>
          <Setting title="Theme">
            <S.SettingContainer>
              <label htmlFor="settings-theme-colorThemes">Color Themes</label>
              <ColorSwitcher />
            </S.SettingContainer>
            <S.SettingContainer>
              <label htmlFor="settings-theme-hourFormat">Hour Format</label>
              <Select
                control={control}
                name="theme.hourFormat"
                id="settings-theme-hourFormat"
                label="Hour Format"
              >
                {/* TODO: Refactor */}
                {[
                  { value: 12, name: '12-hour' },
                  { value: 24, name: '24-hour' },
                ].map(({ value, name }, index) => (
                  <option key={`${name}-${index}`} value={value}>
                    {name}
                  </option>
                ))}
              </Select>
            </S.SettingContainer>
          </Setting>
          <Setting title="Others">
            <S.SettingContainer>
              <span>Notification</span>
              <S.NotificationContainer>
                <Select
                  control={control}
                  name="others.notification.type"
                  id="settings-others-notification-type"
                  label="Notification Type"
                >
                  {/* TODO: Refactor */}
                  {[
                    { value: 'last', name: 'Last' },
                    { value: 'every', name: 'Every' },
                  ].map(({ value, name }, index) => (
                    <option key={`${name}-${index}`} value={value}>
                      {name}
                    </option>
                  ))}
                </Select>
                <Input
                  {...register('others.notification.interval', {
                    valueAsNumber: true,
                  })}
                  type="number"
                  step="1"
                  aria-label="Notification Interval"
                />
                <span>min</span>
              </S.NotificationContainer>
            </S.SettingContainer>
          </Setting>
          <S.Footer>
            <button type="submit" disabled={!isValid}>
              Ok
            </button>
          </S.Footer>
        </S.SettingsForm>
      </S.Container>
    </FocusLock>
  );
}

export default Settings;
