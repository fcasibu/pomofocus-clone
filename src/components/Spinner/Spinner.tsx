import { colors, zSpinner } from '@utils';
import { VscLoading } from 'react-icons/vsc';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const S = {
  Container: styled.div`
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: ${zSpinner};

    > div {
      animation: ${spin} 1s infinite;
      color: ${colors.WHITE};
    }
  `,
};

export function Spinner() {
  return (
    <S.Container>
      <div>
        <VscLoading size={75} />
      </div>
    </S.Container>
  );
}

export default Spinner;
