import { useRouteError } from 'react-router';
import styled from 'styled-components';

const S = {
  Container: styled.div`
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);

    > h1 {
      font-size: 32px;
    }
  `,
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <S.Container>
      <h1>404 Page Not Found :(</h1>
    </S.Container>
  );
}

export default ErrorBoundary;
