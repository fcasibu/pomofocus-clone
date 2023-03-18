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
    width: 100%;
    height: 100%;
    background-color: ${colors.RED};
    color: ${colors.WHITE};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${spacing.XXS};

    > h1 {
      font-size: 18px;
      font-weight: 700;
      animation: ${pulse} 0.5s ease-in-out infinite;
    }
  `,
};

export default function Loading() {
  return (
    <S.Container>
      <FaCheckCircle size={70} />
      <h1>Loading...</h1>
    </S.Container>
  );
}
