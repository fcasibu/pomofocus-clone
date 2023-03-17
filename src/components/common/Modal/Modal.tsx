import { useModal } from '@hooks/useModal';
import { zSettingsBackdrop } from '@utils';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
};

const modalRoot = document.getElementById('settings-modal-root') as HTMLDivElement;

export function Modal({ children }: { children: ReactNode }) {
  const { close } = useModal();

  return createPortal(
    <>
      <S.Backdrop onClick={close} />
      {children}
    </>,
    modalRoot,
  );
}

export default Modal;
