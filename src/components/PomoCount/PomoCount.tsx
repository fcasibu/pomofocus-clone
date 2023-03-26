import { useTimerStore } from '@stores';
import { colors, spacing } from '@utils';
import styled from 'styled-components';

const S = {
  Container: styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: ${spacing.XXXS};
  `,

  Count: styled.button`
    all: unset;
    color: ${colors.WHITE};
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }

    &:focus-visible {
      outline: auto;
    }
  `,
};

// TODO: Selected Task Name after task list is implemented
export function PomoCount() {
  const { currentTimerName, done, reset } = useTimerStore((state) => ({
    done: state.done,
    currentTimerName: state.currentTimerName,
    reset: state.reset,
  }));

  const title =
    currentTimerName === 'POMO' ? 'Time to focus!' : 'Time for a break!';

  const handleClick = () => {
    const shouldReset = confirm('Do you want to reset the pomodoro count?');
    if (!shouldReset) return;
    reset();
  };

  return (
    <S.Container>
      <S.Count
        type="button"
        aria-label={`Reset pomodoro count #${done}`}
        onClick={handleClick}
      >
        #{done}
      </S.Count>
      <p>{title}</p>
    </S.Container>
  );
}

export default PomoCount;
