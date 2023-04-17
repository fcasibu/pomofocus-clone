import { MODAL_ROOT } from '@constants';
import { useModalStore } from '@stores';
import { zSettingsBackdrop } from '@utils';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';

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

export function Modal({ children }: { children: ReactNode }) {
  const { close, open, openedModal } = useModalStore(
    (state) => ({
      close: state.close,
      open: state.open,
      openedModal: state.openedModal,
    }),
    shallow,
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (openedModal !== 'colors') {
          close();
        } else {
          open('settings');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return createPortal(
    <>
      <S.Backdrop
        onClick={() => (openedModal !== 'colors' ? close() : open('settings'))}
      />
      {children}
    </>,
    MODAL_ROOT,
  );
}

export default Modal;
