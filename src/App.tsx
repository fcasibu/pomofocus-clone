import { Timer } from '@components';
import { Header } from '@components/Header';
import { useTimer } from '@hooks';
import { Options } from '@options';
import { colors, spacing } from '@utils';
import { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const S = {
  Background: styled.div`
    background-color: ${({ theme }) => theme.bg};
    height: 100%;
    transition: background-color 0.5s;
  `,
  Container: styled.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${spacing.XXXS};
  `,
};

function App() {
  const { currentTimerName, currentTime } = useTimer();

  useEffect(() => {
    if (currentTimerName === 'POMO') {
      document.title = `${currentTime} | Time to focus!`;
    } else {
      document.title = `${currentTime} | Time for a break!`;
    }
  }, [currentTime]);

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
