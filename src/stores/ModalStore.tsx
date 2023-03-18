import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ModalType = 'settings' | 'closed';

type ModalState = {
  openedModal: ModalType;
};

type ModalActions = {
  open(modal: ModalType): void;
  close(): void;
};

export const useModalStore = create(
  immer<ModalState & ModalActions>((set) => ({
    openedModal: 'closed',
    open: (newModal: ModalType) =>
      set((state) => {
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
