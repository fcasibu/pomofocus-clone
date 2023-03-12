import { ConfigContext } from '@context';
import { useContext } from 'react';

export function useConfig() {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error(`useConfig must be used inside a ConfigProvider`);
  }

  return context;
}
