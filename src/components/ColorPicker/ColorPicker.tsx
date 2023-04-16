import { useConfigStore, useModalStore } from '@stores';
import type { TimerName } from '@types';
import { colors, ModalContainer, spacing } from '@utils';
import produce from 'immer';
import FocusLock from 'react-focus-lock';
import { FaCheck } from 'react-icons/fa';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';

const S = {
  Container: styled.div`
    ${ModalContainer}
    max-height: 600px;
    max-width: 400px;
    overflow-y: auto;
  `,

  Colors: styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing.XXXS};
  `,

  Color: styled.li<{ $color: string }>`
    aspect-ratio: 1/1;
    background-color: ${({ $color }) => $color};
    border-radius: 5px;
    cursor: pointer;
    display: grid;
    list-style-type: none;
    place-items: center;
    position: relative;
    width: 67px;

    > button {
      all: unset;
      height: 100%;
      width: 100%;

      &:focus-visible {
        outline: auto;
      }
    }

    > div {
      color: ${colors.WHITE};
      pointer-events: none;
      position: absolute;
    }
  `,

  Header: styled.div`
    align-items: center;
    border-bottom: 1px solid ${colors.TRANSPARENT_BLACK};
    color: ${colors.BLACK};
    display: flex;
    gap: ${spacing.XXS};
    justify-content: space-between;
    margin: 0 -${spacing.XS} ${spacing.S} -${spacing.XS};
    padding-bottom: ${spacing.XXS};

    > h2 {
      font-size: 14px;
      font-weight: 700;
      margin: 0 auto;
    }
  `,
};

const colorsToInclude = [
  'RED',
  'TEAL',
  'LIGHT_BLUE',
  'LIGHT_GOLD',
  'LIGHT_PURPLE',
  'PINK',
  'GREEN',
  'LIGHT_GREY',
];

const listOfColors = Object.entries(colors).filter(([colorKey]) =>
  colorsToInclude.includes(colorKey),
);

export function ColorPicker() {
  const { colorFor, open } = useModalStore(
    (state) => ({
      open: state.open,
      colorFor: state.colorFor,
    }),
    shallow,
  );
  const { theme, updateTheme } = useConfigStore(
    (state) => ({
      theme: state.config.theme,
      updateTheme: state.updateTheme,
    }),
    shallow,
  );

  const handleClick = (newColorValue: string) => () => {
    updateTheme(
      produce(theme, (draft) => {
        draft.colorThemes[colorFor as TimerName] = newColorValue;
      }),
    );
    open('settings');
  };

  return (
    <FocusLock>
      <S.Container
        aria-labelledby="colorPicker-modal-label"
        role="dialog"
        aria-modal="true"
      >
        <S.Header>
          <h2 id="colorPicker-modal-label">Pick a color for {colorFor}</h2>
        </S.Header>
        <S.Colors>
          {listOfColors.map(([colorKey, colorValue]) => (
            <S.Color key={colorKey} $color={colorValue}>
              <button
                type="button"
                aria-label={colorKey}
                onClick={handleClick(colorValue)}
              />
              {colorFor && theme.colorThemes[colorFor] === colorValue ? (
                <div>
                  <FaCheck size={15} />
                </div>
              ) : null}
            </S.Color>
          ))}
        </S.Colors>
      </S.Container>
    </FocusLock>
  );
}

export default ColorPicker;
