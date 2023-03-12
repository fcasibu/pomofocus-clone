import { colors } from '@utils';
import { useRouteError } from 'react-router';
import styled from 'styled-components';

const S = {
  Container: styled.div`
    background-color: ${colors.RED};
    display: grid;
    height: 100%;
    left: 50%;
    place-items: center;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;

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
      <h1>Something went wrong!</h1>
    </S.Container>
  );
}

export default ErrorBoundary;
