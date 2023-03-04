import styled from 'styled-components';
import { Header } from '@components/Header';

const S = {
  Container: styled.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
  `,
};

function App() {
  return (
    <S.Container>
      <Header />
    </S.Container>
  );
}

export default App;
