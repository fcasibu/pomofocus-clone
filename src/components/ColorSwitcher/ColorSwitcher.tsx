import { useConfigStore, useModalStore } from '@stores';
import type { TimerName } from '@types';
import { spacing } from '@utils';
import styled from 'styled-components';

const S = {
  Colors: styled.ul`
    display: flex;
    gap: ${spacing.XXXS};
    margin: 0;
  `,

  Color: styled.button<{ $color: string }>`
    all: unset;
    background-color: ${({ $color }) => $color};
    border-radius: 50%;
    cursor: pointer;
    height: 25px;
    width: 25px;

    &:focus-visible {
      outline: auto;
    }
  `,
};

export function ColorSwitcher() {
  const theme = useConfigStore((state) => state.config.theme);
  const open = useModalStore((state) => state.open);

  const handleClick = (colorFor?: TimerName) => () => {
    open('colors', colorFor);
  };

  return (
    <S.Colors id="settings-theme-colorThemes">
      {Object.entries(theme.colorThemes).map(([key, value], index) => (
        <li key={`${key}-${index}`}>
          <S.Color
            $color={value}
            type="button"
            aria-label={`Open modal for ${key}`}
            onClick={handleClick(key as TimerName)}
          />
        </li>
      ))}
    </S.Colors>
  );
}

export default ColorSwitcher;
