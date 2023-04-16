import { yupResolver } from '@hookform/resolvers/yup';
import { templateSchema } from '@schemas/templateSchema';
import { useModalStore, useTemplateStore } from '@stores';
import { colors, ModalContainer, ModalFooter, spacing } from '@utils';
import FocusLock from 'react-focus-lock';
import { useForm } from 'react-hook-form';
import { VscClose } from 'react-icons/vsc';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';

const S = {
  Form: styled.form`
    ${ModalContainer}
    max-width: 400px;
    overflow: hidden;
  `,

  Footer: styled.div`
    ${ModalFooter}

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

    > div {
      display: flex;
      gap: ${spacing.S};
      justify-content: flex-end;

      > button:last-child {
        all: unset;
        background-color: ${colors.BLACK};
        border-radius: 4px;
        color: ${colors.WHITE};
        cursor: pointer;
        display: block;
        font-size: 12px;
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

export function TemplateForm() {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<{ name: string }>({
    mode: 'onChange',
    resolver: yupResolver(templateSchema),
  });
  const save = useTemplateStore((state) => state.saveTemplate);
  const { open, close } = useModalStore(
    (state) => ({ open: state.open, close: state.close }),
    shallow,
  );

  const onSubmit = ({ name }: { name: string }) => {
    save(name);
    open('template-save-to');
  };

  return (
    <FocusLock>
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <S.Header>
          <h2 id="settings-modal-label">Save Template</h2>
          <button type="button" onClick={close} aria-label="Close Settings">
            <VscClose size={20} />
          </button>
        </S.Header>
        <S.Input placeholder="Name this template" {...register('name')} />
        <S.Footer>
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

export default TemplateForm;
