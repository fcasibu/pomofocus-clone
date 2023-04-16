import { css } from 'styled-components';
import { colors } from './colors';
import { spacing } from './spacing';
import { zSettingsModal } from './zIndex';

export const ModalContainer = css`
  background-color: ${colors.WHITE};
  border-radius: 5px;
  color: ${colors.BLACK};
  left: 50%;
  padding: ${spacing.XS};
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  z-index: ${zSettingsModal};
`;

export const ModalFooter = css`
  background-color: ${colors.TRANSPARENT_BLACK};
  margin: 0 -${spacing.XS} -${spacing.XS};
  padding: ${spacing.XXXS} ${spacing.XS};
`;

export const ModalHeader = css`
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
`;
