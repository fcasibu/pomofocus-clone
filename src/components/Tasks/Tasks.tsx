import { Spinner } from '@components/Spinner';
import { Modal } from '@components/common';
import type { Task } from '@stores';
import {
  useConfigStore,
  useModalStore,
  useTasksStore,
  useTimerStore,
} from '@stores';
import { colors, spacing } from '@utils';
import { getTime } from '@utils/getTime';
import {
  Suspense,
  lazy,
  memo,
  useMemo,
  useState,
  type MouseEvent,
} from 'react';
import { FaCheckCircle, FaEllipsisV, FaPlusCircle } from 'react-icons/fa';
import styled, { css } from 'styled-components';

const TasksForm = lazy(() => import('./TasksForm'));

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

  CheckButton: styled.button<{ $isFinished: boolean }>`
    all: unset;
    opacity: ${({ $isFinished }) => ($isFinished ? 1 : 0.3)};

    svg {
      fill: ${({ theme, $isFinished }) => ($isFinished ? theme.bg : 'auto')};
      pointer-events: none;
    }

    &:focus-visible {
      outline: auto;
    }

    &:hover {
      svg {
        fill: ${({ $isFinished, theme }) => (!$isFinished ? theme.bg : 'auto')};
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

    svg {
      pointer-events: none;
    }
  `,

  Note: styled.p`
    background-color: ${colors.PASTEL_YELLOW};
    border-radius: 3px;
    color: ${colors.BLACK};
    cursor: text;
    font-size: 13px;
    margin: 0 ${spacing.S} ${spacing.XS} ${spacing.S};
    padding: ${spacing.XXS};
    white-space: pre-wrap;
  `,

  Stats: styled.div`
    background-color: ${colors.TRANSPARENT_WHITE};
    border-radius: 4px;
    border-top: 2px solid ${colors.WHITE};
    display: flex;
    flex-wrap: wrap;
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
    background-color: ${colors.WHITE};
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position: relative;

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

    > div {
      align-items: center;
      border-radius: 3px;
      color: ${colors.LIGHT_GREY};
      display: flex;
      font-weight: 600;
      gap: ${spacing.S};
      justify-content: space-between;
      overflow: hidden;
      padding: ${spacing.S};

      > div {
        align-items: center;
        display: flex;
        gap: ${spacing.XXXS};
        overflow-wrap: anywhere;

        &:last-child {
          gap: ${spacing.XS};
          overflow-wrap: unset;
        }
      }
    }
  `,

  Title: styled.h3`
    font-weight: 700;
  `,
};

export const Tasks = memo(() => {
  const {
    tasks,
    toggleFinishTask,
    selectTask,
    countEstimatedPomodoros,
    countFinishedPomodoros,
  } = useTasksStore((state) => ({
    tasks: state.tasks,
    addTask: state.addTask,
    toggleFinishTask: state.toggleFinishTask,
    selectTask: state.selectTask,
    countEstimatedPomodoros: state.countEstimatedPomodoros,
    countFinishedPomodoros: state.countFinishedPomodoros,
  }));
  const modal = useModalStore();
  const { time, hourFormat } = useConfigStore((state) => ({
    time: state.config.timer.time,
    hourFormat: state.config.theme.hourFormat,
  }));
  const currentTimerName = useTimerStore((state) => state.currentTimerName);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>();

  const handleSelect = (id: string) => (event: MouseEvent<HTMLElement>) => {
    const isNotSelectable = !!(event.target as HTMLElement).getAttribute(
      'data-no-select',
    );
    if (isNotSelectable) return;

    selectTask(id);
  };

  const handleOpenForm = (task?: Task) => () => {
    setTaskToEdit(task);
    modal.open('task-form');
  };

  const estimatedPomodoros = useMemo(() => countEstimatedPomodoros(), [tasks]);
  const finishedPomodoros = useMemo(() => countFinishedPomodoros(), [tasks]);

  const { formattedTime, diff } = useMemo(() => {
    const chosenTimeInSeconds =
      currentTimerName !== 'POMO'
        ? time[currentTimerName] + time.POMO
        : time.POMO;

    return getTime(
      chosenTimeInSeconds * Math.max(0, estimatedPomodoros - finishedPomodoros),
      hourFormat,
    );
  }, [
    currentTimerName,
    hourFormat,
    tasks,
    estimatedPomodoros,
    finishedPomodoros,
  ]);

  return (
    <S.Container>
      <S.Header>
        <S.Title>Tasks</S.Title>
        <S.IconWrapper
          type="button"
          aria-label="Toggle tasks options dropdown"
          $isTransparent
        >
          <FaEllipsisV />
        </S.IconWrapper>
      </S.Header>
      <S.Tasks>
        {tasks.map((task) => (
          <S.Task
            key={task.title}
            $isSelected={task.isSelected}
            onClick={handleSelect(task.id)}
          >
            <div>
              <div>
                <S.CheckButton
                  type="button"
                  aria-label="Mark Task as complete"
                  onClick={() => toggleFinishTask(task.id)}
                  $isFinished={task.isFinished}
                  data-no-select
                >
                  <FaCheckCircle size={25} />
                </S.CheckButton>
                <span>{task.title}</span>
              </div>
              <div>
                <span>
                  {task.finishedPomodoros} / {task.estimatedPomodoros}
                </span>
                <S.IconWrapper
                  type="button"
                  aria-label="Edit Task"
                  data-no-select
                  onClick={handleOpenForm(task)}
                >
                  <FaEllipsisV size={12} />
                </S.IconWrapper>
              </div>
            </div>
            {!!task.note && <S.Note data-no-select>{task.note}</S.Note>}
          </S.Task>
        ))}
      </S.Tasks>
      <S.AddTaskButton type="button" onClick={handleOpenForm()}>
        <FaPlusCircle />
        <span>Add Task</span>
      </S.AddTaskButton>
      {tasks.length > 0 && (
        <S.Stats>
          <span>
            Pomos:{' '}
            <strong>
              {finishedPomodoros} / {estimatedPomodoros}
            </strong>
          </span>
          <span>
            Finish In: <strong>{formattedTime}</strong> ({diff}h)
          </span>
        </S.Stats>
      )}
      {modal.openedModal === 'task-form' && (
        <Modal>
          <Suspense fallback={<Spinner />}>
            <TasksForm taskItem={taskToEdit} />
          </Suspense>
        </Modal>
      )}
    </S.Container>
  );
});

Tasks.displayName = 'Tasks';

export default Tasks;
