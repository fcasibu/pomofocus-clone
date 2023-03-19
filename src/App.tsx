import { Header, Modal, Timer } from '@components';
import { Spinner } from '@components/Spinner';
import { useConfigStore, useModalStore, useTimerStore } from '@stores';
import { colors, spacing } from '@utils';
import { Suspense, lazy, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const Settings = lazy(() => import('@components/Settings/Settings'));
const ColorPicker = lazy(() => import('@components/ColorPicker/ColorPicker'));

const S = {
  Background: styled.div`
    background-color: ${({ theme }) => theme.bg};
    height: 100%;
    transition: background-color 0.5s;

    @media (prefers-reduced-motion) {
      transition: none;
    }
  `,

  Container: styled.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${spacing.XXXS};
  `,

  PermissionContainer: styled.div`
    background-color: ${colors.WHITE};
    border-radius: 5px;
    bottom: 20px;
    color: ${colors.BLACK};
    padding: ${spacing.XS};
    position: fixed;
    right: 20px;
    width: max-content;

    > h2 {
      margin-bottom: ${spacing.XXXS};
    }

    > button {
      all: unset;
      background-color: ${colors.BLACK};
      border-radius: 3px;
      color: ${colors.WHITE};
      cursor: pointer;
      font-size: 12px;
      padding: ${spacing.XXXXS};

      &:focus-visible {
        outline: auto;
      }
    }
  `,
};

function App() {
  const currentTimerName = useTimerStore((state) => state.currentTimerName);
  const openedModal = useModalStore((state) => state.openedModal);
  const theme = useConfigStore((state) => state.config.theme);
  const [isOpen, setIsOpen] = useState(true);

  const handlePermission = () => {
    Notification.requestPermission();
    setIsOpen(false);
  };

  return (
    <ThemeProvider
      theme={{ bg: theme.colorThemes[currentTimerName], text: colors.WHITE }}
    >
      <S.Background>
        <S.Container>
          <Header />
          <main>
            <Timer />
            {openedModal === 'settings' ? (
              <Modal>
                <Suspense fallback={<Spinner />}>
                  <Settings />
                </Suspense>
              </Modal>
            ) : null}
            {openedModal === 'colors' ? (
              <Modal>
                <Suspense fallback={<Spinner />}>
                  <ColorPicker />
                </Suspense>
              </Modal>
            ) : null}
          </main>
        </S.Container>
        {'Notification' in window &&
        Notification.permission === 'default' &&
        isOpen ? (
          <S.PermissionContainer
            role="dialog"
            aria-labelledby="notification-dialog-label"
          >
            <h2 id="notification-dialog-label">Allow Notification?</h2>
            <button type="button" onClick={handlePermission}>
              Open notification menu
            </button>
          </S.PermissionContainer>
        ) : null}
      </S.Background>
    </ThemeProvider>
  );
}

export default App;
