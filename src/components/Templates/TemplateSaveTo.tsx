import { useTemplateStore } from '@stores';
import { useModalStore } from '@stores';
import { colors, spacing, ModalContainer, ModalFooter } from '@utils';
import FocusLock from 'react-focus-lock';
import { VscClose } from 'react-icons/vsc';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';

const S = {
  Container: styled.div`
    ${ModalContainer}
    max-width: 400px;
  `,

  Footer: styled.div`
    ${ModalFooter}

    > button {
      all: unset;
      border-radius: 4px;
      color: ${colors.BLACK};
      cursor: pointer;
      display: block;
      font-size: 12px;
      min-width: 42px;
      opacity: 0.8;
      padding: ${spacing.XXS} 0;
      text-align: center;
      text-transform: uppercase;

      &:hover {
        opacity: 0.9;
      }

      &:focus-visible {
        outline: auto;
      }
    }
  `,

  Header: styled.div`
    align-items: center;
    border-bottom: 1px solid ${colors.TRANSPARENT_BLACK};
    color: ${colors.LIGHT_GREY};
    display: flex;
    gap: ${spacing.XXS};
    justify-content: space-between;
    margin: 0 -${spacing.XS};
    padding-bottom: ${spacing.XXS};

    > h2 {
      font-size: 14px;
      font-weight: 700;
      margin: 0 ${spacing.XS};
    }

    > button {
      all: unset;
      cursor: pointer;
      margin: 0 ${spacing.XS};

      &:focus-visible {
        outline: auto;
      }

      &:hover {
        color: ${colors.BLACK};
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

  Templates: styled.ul`
    background-color: ${colors.WHITE};
    color: ${colors.BLACK};
    margin: ${spacing.XXXXS} -${spacing.XS};
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: auto;

    > li > button {
      all: unset;
      align-items: center; /* stylelint-disable-line */
      color: ${colors.BLACK};
      cursor: pointer;
      display: flex;
      font-size: 12px;
      gap: ${spacing.XXXS};
      padding: ${spacing.XXS};
      width: 100%;

      &:hover,
      &:focus-visible {
        background-color: ${colors.TRANSPARENT_BLACK};
      }
    }
  `,
};

export function TemplateSaveTo() {
  const templateNames = useTemplateStore((state) =>
    Object.keys(state.templates),
  );
  const update = useTemplateStore((state) => state.updateTemplate);

  const { open, close } = useModalStore(
    (state) => ({ open: state.open, close: state.close }),
    shallow,
  );

  const handleClick = () => open('template-save');

  const handleUpdate = (name: string) => () => {
    update(name);
    close();
  };

  return (
    <FocusLock>
      <S.Container
        aria-labelledby="template-save-to-label"
        role="dialog"
        aria-modal="true"
      >
        <S.Header>
          <h2 id="template-save-to-label">Save Template to</h2>
          <button type="button" onClick={close} aria-label="Close Modal">
            <VscClose size={20} />
          </button>
        </S.Header>

        <S.Templates>
          {templateNames.map((name) => (
            <li key={name}>
              <button
                type="button"
                onClick={handleUpdate(name)}
                aria-label={`Update template for ${name}`}
              >
                {name}
              </button>
            </li>
          ))}
        </S.Templates>

        <S.Footer>
          <button type="button" onClick={handleClick}>
            + Create new template
          </button>
        </S.Footer>
      </S.Container>
    </FocusLock>
  );
}

export default TemplateSaveTo;
