import type { TimerName } from '@types';
import type { Immutable } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ModalType = 'settings' | 'colors' | 'closed';

type ModalState = Immutable<{
  openedModal: ModalType;
  colorFor?: TimerName;
}>;

type ModalActions = {
  open(modal: ModalType, colorFor?: TimerName): void;
  close(): void;
};

export const useModalStore = create(
  immer<ModalState & ModalActions>((set) => ({
    openedModal: 'closed',
    open: (newModal: ModalType, colorFor?: TimerName) =>
      set((state) => {
        if (colorFor) {
          state.colorFor = colorFor;
        }

        state.openedModal = newModal;
        document.body.style.overflow = 'hidden';
      }),
    close: () =>
      set((state) => {
        state.openedModal = 'closed';
        document.body.style.overflow = 'auto';
      }),
  })),
);
