import { colors, spacing } from '@utils';
import { FaCheckCircle } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    opacity: 0.85;
  }
  100% {
    opacity: 1;
  }
`;

const S = {
  Container: styled.div`
    align-items: center;
    background-color: ${colors.RED};
    color: ${colors.WHITE};
    display: flex;
    flex-direction: column;
    gap: ${spacing.XXS};
    height: 100%;
    justify-content: center;
    width: 100%;

    > h1 {
      animation: ${pulse} 0.5s ease-in-out infinite;
      font-size: 18px;
      font-weight: 700;
    }
  `,
};

export function Loading() {
  return (
    <S.Container>
      <FaCheckCircle size={70} />
      <h1>Loading...</h1>
    </S.Container>
  );
}

export default Loading;
