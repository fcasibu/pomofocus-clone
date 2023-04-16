export const TIMER_NAME = {
  POMO: 'POMO',
  SHORT: 'SHORT',
  LONG: 'LONG',
} as const;

export const KEY = 'pomofocus-config';

export const TIMER_KEY = 'pomofocus-timer';

export const TASKS_KEY = 'pomofocus-tasks';

export const TEMPLATES_KEY = 'pomofocus-templates';

export const ONE_SECOND = 1000;

export const MODAL_ROOT = document.getElementById(
  'modal-root',
) as HTMLDivElement;
