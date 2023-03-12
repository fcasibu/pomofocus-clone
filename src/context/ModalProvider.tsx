import type { ReactNode } from 'react';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export type ModalType = 'settings' | 'closed';

type ModalContextType = {
  openedModal: ModalType;
  open: (modal: Exclude<ModalType, 'closed'>) => void;
  close: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openedModal, setOpenedModal] = useState<ModalType>('closed');

  const open = useCallback((modal: Exclude<ModalType, 'closed'>) => {
    setOpenedModal(modal as ModalType);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setOpenedModal('closed');
    document.body.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const value = useMemo(() => ({ openedModal, open, close }), [openedModal, open, close]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
