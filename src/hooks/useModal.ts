import { ModalContext } from '@context';
import { useContext } from 'react';

export function useModal() {
  const ctx = useContext(ModalContext);

  if (!ctx) {
    throw new Error('useModal must be used within a ModalContext');
  }

  return ctx;
}
