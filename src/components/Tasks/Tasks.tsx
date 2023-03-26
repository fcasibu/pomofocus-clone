import { colors, spacing } from '@utils';
import { FaCheckCircle, FaEllipsisV, FaPlusCircle } from 'react-icons/fa';
import styled, { css } from 'styled-components';

const S = {
  AddTaskButton: styled.button`
    align-items: center;
    all: unset;
    background-color: ${colors.TRANSPARENT_BLACK};
    border: 1px dashed ${colors.WHITE};
    cursor: pointer;
    display: flex;
    font-weight: 600;
    gap: ${spacing.XXXS};
    justify-content: center;
    margin-bottom: ${spacing.XS};
    opacity: 0.8;
    padding: ${spacing.S} 0;
    width: 100%;

    &:hover {
      opacity: 1;
    }

    &:focus-visible {
      outline: auto;
    }
  `,

  CheckButton: styled.button`
    all: unset;

    &:focus-visible {
      outline: auto;
    }

    svg {
      opacity: 0.2;

      &:hover {
        opacity: 1;
      }
    }
  `,

  Container: styled.div`
    margin: 0 auto;
    max-width: 480px;
  `,

  Header: styled.header`
    align-items: center;
    border-bottom: 2px solid ${colors.WHITE};
    display: flex;
    justify-content: space-between;
    padding-bottom: ${spacing.XS};
  `,

  IconWrapper: styled.button<{ $isTransparent?: boolean }>`
    all: unset;
    background-color: ${colors.TRANSPARENT_WHITE};
    border-radius: 4px;
    cursor: pointer;
    ${({ $isTransparent }) =>
      $isTransparent
        ? css`
            background-color: ${colors.TRANSPARENT_WHITE};
            color: ${colors.WHITE};
            padding: ${spacing.XXXS};
          `
        : css`
            box-shadow: 0 1px 5px hsla(0 0% 0% / 0.3);
            color: ${colors.LIGHT_GREY};
            padding: ${spacing.XXXXS};
          `}

    &:hover {
      background-color: ${({ $isTransparent }) =>
        $isTransparent ? 'hsla(0 0% 100% / 0.15)' : colors.TRANSPARENT_BLACK};
    }

    &:focus-visible {
      outline: auto;
    }
  `,

  Stats: styled.div`
    background-color: ${colors.TRANSPARENT_WHITE};
    border-radius: 4px;
    border-top: 2px solid ${colors.WHITE};
    display: flex;
    gap: ${spacing.XS};
    justify-content: center;
    padding: ${spacing.L};

    > span {
      font-size: 14px;
      font-weight: 300;
    }

    strong {
      font-size: 18px;
      font-weight: 700;
    }
  `,

  Tasks: styled.ul`
    display: flex;
    flex-direction: column;
    gap: ${spacing.XXXXS};
    margin: ${spacing.XS} 0 ${spacing.XXXS};
  `,

  Task: styled.li<{ $isSelected: boolean }>`
    align-items: center;
    background-color: ${colors.WHITE};
    border-radius: 3px;
    color: ${colors.LIGHT_GREY};
    cursor: pointer;
    display: flex;
    font-weight: 600;
    justify-content: space-between;
    overflow: hidden;
    padding: ${spacing.S};
    position: relative;

    > div {
      align-items: center;
      display: flex;
      gap: ${spacing.XXXS};

      &:last-child {
        gap: ${spacing.XS};
      }
    }

    &:before {
      background-color: ${colors.BLACK};
      content: '';
      height: 100%;
      left: 0;
      opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
      position: absolute;
      width: 6px;
    }

    &:hover::before {
      opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0.2)};
    }
  `,

  Title: styled.h3`
    font-weight: 700;
  `,
};

const tasks = [
  {
    name: 'test 1',
    isSelected: true,
  },
  {
    name: 'test 2',
    isSelected: false,
  },
];

export function Tasks() {
  return (
    <S.Container>
      <S.Header>
        <S.Title>Tasks</S.Title>
        <S.IconWrapper $isTransparent>
          <FaEllipsisV />
        </S.IconWrapper>
      </S.Header>
      <S.Tasks>
        {tasks.map((task) => (
          <S.Task key={task.name} $isSelected={task.isSelected}>
            <div>
              <S.CheckButton type="button" aria-label="Mark as complete">
                <FaCheckCircle size={25} />
              </S.CheckButton>
              <span>{task.name}</span>
            </div>
            <div>
              <span>0/1</span>
              <S.IconWrapper>
                <FaEllipsisV size={12} />
              </S.IconWrapper>
            </div>
          </S.Task>
        ))}
      </S.Tasks>
      <S.AddTaskButton>
        <FaPlusCircle />
        <span>Add Task</span>
      </S.AddTaskButton>
      <S.Stats>
        <span>
          Pomos: <strong>4/5</strong>
        </span>
        <span>
          Finish In: <strong>10:48 PM</strong> (0.4h)
        </span>
      </S.Stats>
    </S.Container>
  );
}

export default Tasks;
