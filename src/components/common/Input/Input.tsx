import { colors, spacing } from '@utils';
import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styled from 'styled-components';

type RequiredID = {
  label: string;
  id: string;
};

type InputPropsBase = InputHTMLAttributes<HTMLInputElement>;

export type InputProps = InputPropsBase & (RequiredID | { label?: never });

const S = {
  Container: styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: ${spacing.XXXXS};
  `,

  Input: styled.input`
    background-color: ${colors.TRANSPARENT_BLACK};
    border: 0;
    color: ${colors.BLACK};
    max-width: 115px;
    padding: ${spacing.XXXS};
    width: 100%;
  `,

  Label: styled.label`
    color: ${colors.LIGHTER_GREY};
    font-size: 13px;
    font-weight: 700;
    user-select: none;
  `,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ type = 'text', id, label, ...props }, ref) =>
  label ? (
    <S.Container>
      <S.Label htmlFor={id}>{label}</S.Label>
      <S.Input type={type} id={id} {...props} ref={ref} />
    </S.Container>
  ) : (
    <S.Input type={type} id={id} {...props} ref={ref} />
  ),
);

Input.displayName = 'Input';

export default Input;
