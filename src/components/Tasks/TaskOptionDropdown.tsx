import { FaPlus, FaRegSave, FaRegTrashAlt } from 'react-icons/fa';
import styled from 'styled-components';
import FocusLock from 'react-focus-lock';
import { useModalStore, useTasksStore, useTemplateStore } from '@stores';
import { shallow } from 'zustand/shallow';
import { colors, spacing } from '@utils';
import { useCallback, useRef } from 'react';
import { useOutsideClick } from '@hooks';

type TaskOptionDropdownProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const S = {
  Dropdown: styled.ul`
    background-color: ${colors.WHITE};
    border-radius: 4px;
    box-shadow: 0 0 15px ${colors.TRANSPARENT_BLACK};
    color: ${colors.BLACK};
    margin: ${spacing.XXXXS} 0;
    max-width: 190px;
    overflow: hidden;
    width: 100%;

    > li > button {
      all: unset;
      align-items: center; /* stylelint-disable-line */
      color: ${colors.BLACK};
      cursor: pointer;
      display: flex;
      font-size: 12px;
      gap: ${spacing.XXXS};
      padding: ${spacing.XXXS} ${spacing.XXS};
      width: 100%;

      &:hover,
      &:focus-visible {
        background-color: ${colors.TRANSPARENT_BLACK};
      }
    }
  `,
};

const tasksOptions = [
  {
    title: 'Clear finished tasks',
    type: 'CLEAR_FINISHED_TASKS',
    Icon: FaRegTrashAlt,
  },
  { title: 'Save as template', type: 'SAVE_TEMPLATE', Icon: FaRegSave },
  { title: 'Add from templates', type: 'ADD_FROM_TEMPLATE', Icon: FaPlus },
  { title: 'Clear templates', type: 'CLEAR_TEMPLATES', Icon: FaRegTrashAlt },
  { title: 'Clear all tasks', type: 'CLEAR_ALL_TASKS', Icon: FaRegTrashAlt },
];

export function TaskOptionDropdown({ setIsOpen }: TaskOptionDropdownProps) {
  const open = useModalStore((state) => state.open);
  const clear = useTasksStore((state) => state.clear, shallow);
  const hasTasks = useTasksStore((state) => state.tasks.length > 0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasTemplates = useTemplateStore(
    (state) => Object.keys(state.templates).length > 0,
  );
  const clearTemplates = useTemplateStore((state) => state.clearTemplates);

  const handleTaskOptionClick = (type: string) => () => {
    switch (type) {
      case 'CLEAR_ALL_TASKS':
      case 'CLEAR_FINISHED_TASKS':
        clear(type);
        break;
      case 'SAVE_TEMPLATE':
        if (hasTasks) {
          open(hasTemplates ? 'template-save-to' : 'template-save');
        } else {
          alert('Please add some tasks first');
        }
        break;
      case 'ADD_FROM_TEMPLATE':
        open('template-list');
        break;
      case 'CLEAR_TEMPLATES':
        clearTemplates();
        break;
      default:
        throw new Error(`Unexpected type ${type}`);
    }
    setIsOpen(false);
  };

  const close = useCallback(() => setIsOpen(false), []);

  useOutsideClick(elementRef, close);

  return (
    <FocusLock ref={elementRef}>
      <S.Dropdown>
        {tasksOptions.map(({ title, type, Icon }) => (
          <li key={type}>
            <button type="button" onClick={handleTaskOptionClick(type)}>
              <Icon />
              <span>{title}</span>
            </button>
          </li>
        ))}
      </S.Dropdown>
    </FocusLock>
  );
}

export default TaskOptionDropdown;
