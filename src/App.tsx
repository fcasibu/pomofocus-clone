import styled from 'styled-components';
import { Header } from '@components/Header';
import { Timer } from '@components';
import { spacing } from '@utils';

const S = {
  Container: styled.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${spacing.XXXS};
  `,
};

function App() {
  return (
    <S.Container>
      <Header />
      <main>
        <Timer />
      </main>
    </S.Container>
  );
}

export default App;
