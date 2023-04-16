import { useModalStore, useTemplateStore } from '@stores';
import { colors, ModalContainer, ModalHeader, spacing } from '@utils';
import type { SyntheticEvent } from 'react';
import { useRef } from 'react';
import { VscClose } from 'react-icons/vsc';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';

const S = {
  Container: styled.div`
    ${ModalContainer}
    max-width: 400px;
    min-height: 110px;
    padding-bottom: 0;

    > p {
      margin-top: ${spacing.XS};
      text-align: center;
    }
  `,

  Header: styled.div`
    ${ModalHeader}
    justify-content: center;
    text-align: center;
  `,
  Templates: styled.ul`
    background-color: ${colors.WHITE};
    color: ${colors.BLACK};
    margin: 0 -${spacing.XS};
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: auto;

    > li {
      align-items: center;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      padding: ${spacing.XXS} ${spacing.XS};
      width: 100%;

      &:hover,
      &:focus-visible {
        background-color: ${colors.TRANSPARENT_BLACK};
      }
    }

    > li > span {
      font-size: 15px;
    }

    > li > button {
      all: unset;
    }
  `,
};

export function TemplateList() {
  const templateNames = useTemplateStore((state) =>
    Object.keys(state.templates),
  );
  const close = useModalStore((state) => state.close);
  const { add, deleteTemplate } = useTemplateStore(
    (state) => ({
      add: state.addTemplate,
      deleteTemplate: state.deleteTemplate,
    }),
    shallow,
  );
  const deleteRef = useRef<HTMLButtonElement>(null);
  const handleAdd = (name: string) => (event: SyntheticEvent) => {
    if (deleteRef.current && event.target !== deleteRef.current) {
      add(name);
      close();
    }
  };
  const handleDelete = (name: string) => (event: SyntheticEvent) => {
    event.stopPropagation();
    deleteTemplate(name);
  };

  return (
    <S.Container>
      <S.Header>
        <h2 id="settings-modal-label">Select a template</h2>
      </S.Header>

      {templateNames.length > 0 ? (
        <S.Templates>
          {templateNames.map((name) => (
            <li key={name} onClick={handleAdd(name)}>
              <span>{name}</span>
              <button
                type="button"
                ref={deleteRef}
                onClick={handleDelete(name)}
                aria-label={`Delete ${name} template`}
              >
                <VscClose size={15} />
              </button>
            </li>
          ))}
        </S.Templates>
      ) : (
        <p>No template has been saved yet</p>
      )}
    </S.Container>
  );
}

export default TemplateList;
