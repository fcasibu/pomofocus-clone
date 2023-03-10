import { Timer } from '@components';
import { Header } from '@components/Header';
import { useTimer } from '@hooks';
import { Options } from '@options';
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
  const { currentTimerName } = useTimer();

  return (
    <ThemeProvider theme={{ bg: Options.theme.colorThemes[currentTimerName], text: colors.WHITE }}>
      <S.Background>
        <S.Container>
          <Header />
          <main>
            <Timer />
          </main>
        </S.Container>
      </S.Background>
    </ThemeProvider>
  );
}

export default App;
