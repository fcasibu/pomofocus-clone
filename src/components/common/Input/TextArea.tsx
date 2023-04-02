import { colors, spacing } from '@utils';
import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styled from 'styled-components';

type RequiredID = {
  label: string;
  id: string;
};

type TextAreaPropsBase = TextareaHTMLAttributes<HTMLTextAreaElement>;

export type TextAreaProps = TextAreaPropsBase &
  (RequiredID | { label?: never });

const S = {
  Container: styled.div`
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: ${spacing.XXXXS};
  `,

  TextArea: styled.textarea`
    background-color: ${colors.TRANSPARENT_BLACK};
    border: 0;
    color: ${colors.BLACK};
    padding: ${spacing.XXXS};
    resize: vertical;
    width: 100%;

    &::placeholder {
      font-size: 12px;
    }
  `,

  Label: styled.label`
    color: ${colors.LIGHTER_GREY};
    font-size: 13px;
    font-weight: 700;
    user-select: none;
  `,
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ id, label, ...props }, ref) =>
    label ? (
      <S.Container>
        <S.Label htmlFor={id}>{label}</S.Label>
        <S.TextArea id={id} {...props} ref={ref} />
      </S.Container>
    ) : (
      <S.TextArea id={id} {...props} ref={ref} />
    ),
);

TextArea.displayName = 'TextArea';

export default TextArea;
