import { Input, TextArea } from '@components/common';
import { yupResolver } from '@hookform/resolvers/yup';
import type { Task } from '@stores';
import { useModalStore, useTasksStore, type TaskFormInput } from '@stores';
import { colors, spacing, zSettingsModal } from '@utils';
import { useState } from 'react';
import FocusLock from 'react-focus-lock';
import { useForm } from 'react-hook-form';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import styled from 'styled-components';
import * as yup from 'yup';

const S = {
  ButtonsContainer: styled.div`
    align-items: center;
    display: flex;
    gap: ${spacing.XXXXS};

    button {
      all: unset;
      background-color: ${colors.WHITE};
      border: 1px solid ${colors.TRANSPARENT_BLACK};
      border-radius: 4px;
      box-shadow: inset 0 -3px ${colors.TRANSPARENT_BLACK};
      color: ${colors.LIGHTER_GREY};
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      padding: 6px ${spacing.XXS};
      text-align: center;
      text-transform: uppercase;

      &:focus-visible {
        outline: auto;
      }

      &:active {
        box-shadow: unset;
        transform: scaleY(0.94) translateY(2px);
      }
    }
  `,

  Form: styled.form`
    background-color: ${colors.WHITE};
    border-radius: 5px;
    color: ${colors.BLACK};
    left: 50%;
    max-width: 400px;
    padding: ${spacing.XS};
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    z-index: ${zSettingsModal};
  `,

  Footer: styled.div`
    align-items: center;
    background-color: ${colors.TRANSPARENT_BLACK};
    display: flex;
    justify-content: space-between;
    margin: 0 -${spacing.XS} -${spacing.XS};
    padding: ${spacing.XXXS} ${spacing.XS};

    button {
      all: unset;
      color: ${colors.LIGHT_GREY};
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;

      &:focus-visible {
        outline: auto;
      }
    }

    > div:last-child {
      display: flex;
      gap: ${spacing.S};

      > button:last-child {
        all: unset;
        background-color: ${colors.BLACK};
        border-radius: 4px;
        color: ${colors.WHITE};
        cursor: pointer;
        display: block;
        font-size: 12px;
        margin-left: auto;
        min-width: 42px;
        opacity: 0.8;
        padding: ${spacing.XXS};
        text-align: center;

        &:hover {
          opacity: 0.9;
        }

        &:focus-visible {
          outline: auto;
        }

        &:disabled {
          background-color: ${colors.LIGHTER_GREY};
          color: ${colors.BLACK};
          cursor: unset;
          opacity: 1;
        }
      }
    }
  `,

  Input: styled.input`
    all: unset;
    color: ${colors.LIGHT_GREY};
    font-size: 18px;
    font-weight: 600;
    padding: ${spacing.M} 0;
    width: 100%;

    &::placeholder {
      color: ${colors.LIGHTER_GREY};
      font-size: 18px;
      font-style: italic;
      font-weight: 600;
      opacity: 0.6;
    }
  `,

  NoteContainer: styled.div`
    margin-bottom: ${spacing.XS};

    > button {
      all: unset;
      color: ${colors.LIGHTER_GREY};
      cursor: pointer;
      font-size: 13px;
      text-decoration: underline;

      &:focus-visible {
        outline: auto;
      }
    }
  `,

  StepperContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: ${spacing.XXXS};
    margin-bottom: ${spacing.XS};

    > label {
      color: ${colors.LIGHTER_GREY};
      font-size: 14px;
      font-weight: 600;
      user-select: none;
      width: max-content;
    }

    > div {
      align-items: center;
      display: flex;
      gap: ${spacing.XXXS};
    }

    input {
      max-width: 70px;
    }
  `,
};

const tasksSchema = yup.object({
  title: yup.string().required(),
  estimatedPomodoros: yup.number().required().min(1).default(1),
  note: yup.string(),
});

type TasksFormProps = {
  taskItem?: Task;
};

export function TasksForm({ taskItem }: TasksFormProps) {
  const { update, add, deleteTask } = useTasksStore((state) => ({
    update: state.editTask,
    add: state.addTask,
    deleteTask: state.deleteTask,
  }));
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<TaskFormInput>({
    defaultValues: taskItem ? { ...taskItem } : { estimatedPomodoros: 1 },
    mode: 'onChange',
    resolver: yupResolver(tasksSchema),
  });
  const close = useModalStore((state) => state.close);
  const [isNoteInputOpen, setIsNoteInputOpen] = useState(!!taskItem?.note);

  const onSubmit = (data: TaskFormInput) => {
    if (taskItem) {
      update(taskItem.id, data);
    } else {
      add(data);
    }
    close();
  };

  const handleStep = (type: 'increase' | 'decrease') => () => {
    const newValue =
      type === 'increase'
        ? getValues('estimatedPomodoros') + 1
        : Math.max(1, getValues('estimatedPomodoros') - 1);
    setValue('estimatedPomodoros', newValue);
  };

  const handleDelete = () => {
    if (taskItem) {
      deleteTask(taskItem?.id);
    }
    close();
  };

  const handleOpenNoteInput = () => {
    setIsNoteInputOpen((prev) => !prev);
  };

  return (
    <FocusLock>
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <S.Input
          placeholder="What are you working on?"
          {...register('title')}
        />
        <S.StepperContainer>
          <label htmlFor="estPomodoros" aria-label="Estimated Pomodoros">
            Est Pomodoros
          </label>
          <div>
            <Input
              id="estPomodoros"
              type="number"
              {...register('estimatedPomodoros', {
                valueAsNumber: true,
              })}
            />
            <S.ButtonsContainer>
              <button
                type="button"
                onClick={handleStep('increase')}
                aria-label="Increase Estimated Pomodoros"
              >
                <FaAngleUp />
              </button>
              <button
                type="button"
                onClick={handleStep('decrease')}
                aria-label="Decrease Estimated Pomodoros"
              >
                <FaAngleDown />
              </button>
            </S.ButtonsContainer>
          </div>
        </S.StepperContainer>
        <S.NoteContainer>
          {!isNoteInputOpen ? (
            <button type="button" onClick={handleOpenNoteInput}>
              + Add Note
            </button>
          ) : (
            <TextArea
              placeholder="Some notes.."
              {...register('note')}
              defaultValue={getValues('note')}
            />
          )}
        </S.NoteContainer>
        <S.Footer>
          <div>
            {!!taskItem && (
              <button type="button" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
          <div>
            <button type="button" onClick={close}>
              Cancel
            </button>
            <button type="submit" disabled={!isValid}>
              Save
            </button>
          </div>
        </S.Footer>
      </S.Form>
    </FocusLock>
  );
}

export default TasksForm;
