import { FaCheckCircle } from 'react-icons/fa';
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

    > div {
      animation: ${spin} 1s infinite;
    }
  `,
};

export function Spinner() {
  return (
    <S.Container>
      <div>
        <FaCheckCircle size={50} />
      </div>
    </S.Container>
  );
}

export default Spinner;
