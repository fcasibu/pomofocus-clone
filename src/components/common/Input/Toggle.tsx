import type { Config, ConfigKeys } from '@context';
import { colors, spacing } from '@utils';
import type { InputHTMLAttributes, KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import type { Control } from 'react-hook-form';
import { useController } from 'react-hook-form';
import styled from 'styled-components';

export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<Config>;
  name: ConfigKeys;
  label?: string;
}

const S = {
  Container: styled.div`
    position: relative;
  `,

  Toggle: styled.input`
    height: 0px;
    left: 0;
    opacity: 0;
    position: absolute;
    visibility: hidden;
    width: 0px;

    &:checked ~ div {
      background-color: ${colors.GREEN};

      &:before {
        transform: translate(89%, -50%);
      }
    }
  `,

  Label: styled.label`
    cursor: pointer;

    > div {
      background-color: ${colors.LIGHTER_GREY};
      border: 0;
      border-radius: 100vw;
      color: ${colors.BLACK};
      padding: ${spacing.XS};
      width: 60px;

      &::before {
        aspect-ratio: 1/1;
        background-color: ${colors.WHITE};
        border-radius: 50%;
        content: '';
        left: 3px;
        position: absolute;
        transform: translateY(-50%);
        transition: transform 0.2s;
        width: 28px;

        @media (prefers-reduced-motion) {
          transition: none;
        }
      }
    }
  `,
};

export const Toggle = ({ control, name, label, ...props }: ToggleProps) => {
  const { field } = useController({
    control,
    name,
  });
  const ref = useRef<HTMLLabelElement | null>(null);
  const [isChecked, setIsChecked] = useState(field.value as boolean);

  const handleToggle = () => {
    if (document.activeElement?.getAttribute('name') !== ref.current?.getAttribute('name')) return;

    setIsChecked((prev) => {
      field.onChange(!prev);
      return !prev;
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLabelElement>) => {
    if (e.code === 'Enter' || e.code === 'Space') {
      handleToggle();
    }
  };

  return (
    <S.Container>
      <S.Label
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="switch"
        aria-checked={isChecked}
        aria-label={label}
        ref={ref}
      >
        <S.Toggle type="checkbox" checked={isChecked} onChange={handleToggle} {...props} />
        <div />
      </S.Label>
    </S.Container>
  );
};

export default Toggle;
