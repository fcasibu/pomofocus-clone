import type { Config, ConfigKeys } from '@context';
import { useConfig } from '@hooks/useConfig';
import { colors, playAudio, spacing } from '@utils';
import produce from 'immer';
import type { ChangeEvent, ReactNode, SelectHTMLAttributes } from 'react';
import type { Control } from 'react-hook-form';
import { useController } from 'react-hook-form';
import styled from 'styled-components';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: ConfigKeys;
  label?: string;
  control: Control<Config>;
  isAudio?: boolean;
  children: ReactNode;
}

const S = {
  Select: styled.select`
    background-color: ${colors.TRANSPARENT_BLACK};
    border: 0;
    color: ${colors.BLACK};
    max-width: 115px;
    padding: ${spacing.XXXS};
    width: 100%;

    > option {
      background: ${colors.TRANSPARENT_BLACK};
      border: 0;
      box-shadow: 0;
      outline: 0;
    }
  `,
};

export const Select = ({ name, label, control, isAudio, children, ...props }: SelectProps) => {
  const { sound, updateSound } = useConfig();
  const { field } = useController({
    name,
    control,
  });

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    field.onChange(event.target.value);
    if (isAudio) {
      updateSound(
        produce(sound, (draft) => {
          draft.alarm.sound = event.target.value;
        }),
      );
      playAudio(event.target.value, sound.alarm.gain);
    }
  };

  return (
    <S.Select name={name} aria-label={label} onChange={handleChange} {...props} defaultValue={field.value as string}>
      {children}
    </S.Select>
  );
};

export default Select;
