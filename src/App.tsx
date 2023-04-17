import { Header, Modal, PomoCount, Spinner, Tasks, Timer } from '@components';
import { KEY, TASKS_KEY, TEMPLATES_KEY, TIMER_KEY } from '@constants';
import {
  useConfigStore,
  useModalStore,
  useTasksStore,
  useTemplateStore,
  useTimerStore,
} from '@stores';
import { colors, spacing } from '@utils';
import { lazy, Suspense, useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const Settings = lazy(() => import('@components/Settings/Settings'));
const ColorPicker = lazy(() => import('@components/ColorPicker/ColorPicker'));
const TemplateForm = lazy(() => import('@components/Templates/TemplateForm'));
const TemplateSaveTo = lazy(
  () => import('@components/Templates/TemplateSaveTo'),
);
const TemplateList = lazy(() => import('@components/Templates/TemplateList'));

const S = {
  Background: styled.div<{ $shouldPad?: boolean }>`
    background-color: ${({ theme }) => theme.bg};
    min-height: 100%;
    padding-right: ${({ $shouldPad }) => $shouldPad && '17px'};
    transition: background-color 0.5s;

    @media (prefers-reduced-motion) {
      transition: none;
    }
  `,

  Container: styled.div`
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${spacing.XXXS};

    > main {
      padding-bottom: ${spacing.XL};
    }
  `,

  PermissionContainer: styled.div`
    background-color: ${colors.WHITE};
    border-radius: 5px;
    bottom: 20px;
    color: ${colors.BLACK};
    padding: ${spacing.XS};
    position: fixed;
    right: 20px;
    width: max-content;

    > h2 {
      margin-bottom: ${spacing.XXXS};
    }

    > button {
      all: unset;
      background-color: ${colors.BLACK};
      border-radius: 3px;
      color: ${colors.WHITE};
      cursor: pointer;
      font-size: 12px;
      padding: ${spacing.XXXXS};

      &:focus-visible {
        outline: auto;
      }
    }
  `,
};

function App() {
  const currentTimerName = useTimerStore((state) => state.currentTimerName);
  const openedModal = useModalStore((state) => state.openedModal);
  const theme = useConfigStore((state) => state.config.theme);
  const [isOpen, setIsOpen] = useState(true);

  const handlePermission = () => {
    Notification.requestPermission();
    setIsOpen(false);
  };

  useEffect(() => {
    const unsubTimer = useTimerStore.subscribe(
      ({ seconds, currentTimerName: timerName, done, isPaused, isPlaying }) => {
        localStorage.setItem(
          TIMER_KEY,
          JSON.stringify({
            seconds,
            currentTimerName: timerName,
            done,
            isPaused,
            isPlaying,
          }),
        );
      },
    );

    const unsubConfig = useConfigStore.subscribe(({ config }) => {
      localStorage.setItem(KEY, JSON.stringify(config));
    });

    const unsubTasks = useTasksStore.subscribe(({ tasks, selectedTask }) => {
      localStorage.setItem(TASKS_KEY, JSON.stringify({ tasks, selectedTask }));
    });

    const unsubTemplates = useTemplateStore.subscribe(({ templates }) => {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify({ templates }));
    });

    return () => {
      unsubTimer();
      unsubConfig();
      unsubTasks();
      unsubTemplates();
    };
  }, []);

  const shouldPad =
    'document' in window &&
    document.body.scrollHeight > document.body.clientHeight;

  return (
    <ThemeProvider
      theme={{ bg: theme.colorThemes[currentTimerName], text: colors.WHITE }}
    >
      <S.Background $shouldPad={openedModal !== 'closed' && shouldPad}>
        <S.Container>
          <Header />
          <main>
            <Timer />
            {openedModal === 'settings' ? (
              <Modal>
                <Suspense fallback={<Spinner />}>
                  <Settings />
                </Suspense>
              </Modal>
            ) : null}
            {openedModal === 'colors' ? (
              <Modal>
                <Suspense fallback={<Spinner />}>
                  <ColorPicker />
                </Suspense>
              </Modal>
            ) : null}
            {openedModal === 'template-save' && (
              <Modal>
                <Suspense fallback={<Spinner />}>
                  <TemplateForm />
                </Suspense>
              </Modal>
            )}
            {openedModal === 'template-save-to' && (
              <Modal>
                <Suspense fallback={<Spinner />}>
                  <TemplateSaveTo />
                </Suspense>
              </Modal>
            )}
            {openedModal === 'template-list' && (
              <Modal>
                <Suspense fallback={<Spinner />}>
                  <TemplateList />
                </Suspense>
              </Modal>
            )}

            <PomoCount />
            <Tasks />
          </main>
        </S.Container>
        {'Notification' in window &&
        Notification.permission === 'default' &&
        isOpen ? (
          <S.PermissionContainer
            role="dialog"
            aria-labelledby="notification-dialog-label"
          >
            <h2 id="notification-dialog-label">Allow Notification?</h2>
            <button type="button" onClick={handlePermission}>
              Open notification menu
            </button>
          </S.PermissionContainer>
        ) : null}
      </S.Background>
    </ThemeProvider>
  );
}

export default App;
