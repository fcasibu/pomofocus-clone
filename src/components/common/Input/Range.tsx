import type { ConfigKeys } from '@stores';
import { useConfigStore } from '@stores';
import type { Config } from '@types';
import { colors, playAudio, spacing } from '@utils';
import produce from 'immer';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { useCallback, useState } from 'react';
import type { Control } from 'react-hook-form';
import { useController } from 'react-hook-form';
import styled from 'styled-components';

export interface RangeProps extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<Config>;
  name: ConfigKeys;
  label?: string;
  isAudio?: boolean;
}

const S = {
  Container: styled.div`
    align-items: center;
    display: flex;
    gap: ${spacing.XXS};

    > span {
      color: ${colors.LIGHTER_GREY};
    }
  `,

  Input: styled.input`
    appearance: none;
    background: ${colors.LIGHTER_GREY};
    border-radius: 9999px;
    cursor: pointer;
    height: 6px;
    width: 100%;
  `,
};

function debounce(fn: (...args: any[]) => void, ms = 1000) {
  let timeout: number;

  return (...args: any[]) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, ms);
  };
}

export const Range = ({ label, control, name, isAudio = true, ...props }: RangeProps) => {
  const { sound, updateSound } = useConfigStore((state) => ({
    sound: state.config.sound,
    updateSound: state.updateSound,
  }));
  const { field } = useController({
    control,
    name,
  });
  const play = useCallback(debounce(playAudio, 500), []);
  const [value, setValue] = useState(Math.floor((field.value as number) * 100));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const v = Number(event.target.value) / 100;
    setValue(Math.floor(v * 100));
    field.onChange(v);
    if (isAudio) {
      updateSound(
        produce(sound, (draft) => {
          draft.alarm.gain = v;
        }),
      );
      play(sound.alarm.sound, v);
    }
  };

  return (
    <S.Container>
      <span>{value}</span>
      <S.Input
        aria-label={`Slide Range for ${label}`}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={handleChange}
        {...props}
      />
    </S.Container>
  );
};

export default Range;
