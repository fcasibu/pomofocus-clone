import { Header, Modal, Settings, Timer } from '@components';
import { useConfigStore, useModalStore, useTimerStore } from '@stores';
import { colors, spacing } from '@utils';
import styled, { ThemeProvider } from 'styled-components';

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
};

function App() {
  const currentTimerName = useTimerStore((state) => state.currentTimerName);
  const openedModal = useModalStore((state) => state.openedModal);
  const theme = useConfigStore((state) => state.config.theme);

  return (
    <ThemeProvider theme={{ bg: theme.colorThemes[currentTimerName], text: colors.WHITE }}>
      <S.Background>
        <S.Container>
          <Header />
          <main>
            <Timer />
            {openedModal === 'settings' ? (
              <Modal>
                <Settings />
              </Modal>
            ) : null}
          </main>
        </S.Container>
      </S.Background>
    </ThemeProvider>
  );
}

export default App;
