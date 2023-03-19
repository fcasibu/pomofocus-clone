import { colors, spacing } from '@utils';
import { useRouteError } from 'react-router';
import styled from 'styled-components';

const S = {
  Container: styled.div`
    align-items: center;
    background-color: ${colors.RED};
    display: flex;
    flex-direction: column;
    gap: ${spacing.XXS};
    height: 100%;
    justify-content: center;
    width: 100%;

    > h1 {
      font-size: 32px;
    }
  `,
  Button: styled.button`
    all: unset;
    background-color: ${colors.WHITE};
    border-radius: 3px;
    color: ${colors.BLACK};
    cursor: pointer;
    font-weight: 500;
    padding: ${spacing.XXS} ${spacing.M};
  `,
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <S.Container role="alert">
      <h1>Something went wrong!</h1>
      <S.Button onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </S.Button>
    </S.Container>
  );
}

export default ErrorBoundary;
