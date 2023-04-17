import { TEMPLATES_KEY } from '@constants';
import type { Draft, Immutable } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Task } from './TasksStore';
import { useTasksStore } from './TasksStore';

type ImmutableTasks = Immutable<Task[]>;

type TemplateState = Immutable<{
  templates: Record<string, ImmutableTasks>;
}>;

type TemplateAction = {
  addTemplate(name: string): void;
  saveTemplate(name: string): void;
  updateTemplate(name: string): void;
  deleteTemplate(name: string): void;
  clearTemplates(): void;
};
let initialState = {
  templates: {},
};

try {
  initialState =
    JSON.parse(localStorage.getItem(TEMPLATES_KEY) as string) ?? initialState;
} catch {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(initialState));
}

export const useTemplateStore = create(
  immer<TemplateState & TemplateAction>((set, get) => ({
    ...initialState,
    addTemplate: (name: string) => {
      const tasksStore = useTasksStore.getState();
      const tasksToAdd = get().templates[name].map((task) => ({
        ...task,
        id: crypto.randomUUID(),
        isSelected: false,
      }));
      if (tasksToAdd) {
        tasksStore.addTasks(tasksToAdd);
      }
    },
    saveTemplate: (name: string) =>
      set((state) => {
        if (name in state.templates) {
          const ok = confirm(
            `${name} already exists as a template, do you want to replace it?`,
          );

          if (!ok) return state;
        }

        state.templates[name] = useTasksStore.getState()
          .tasks as Draft<ImmutableTasks>;
        alert(`The current tasks are saved in ${name}`);
      }),
    updateTemplate: (name: string) =>
      set((state) => {
        if (name in state.templates) {
          const ok = confirm(
            `Do you want to update ${name} with the current tasks?`,
          );

          if (!ok) return state;

          state.templates[name] = useTasksStore.getState()
            .tasks as Draft<ImmutableTasks>;
          alert(`The current tasks are updated to ${name}`);
        }
      }),
    deleteTemplate: (name: string) =>
      set((state) => {
        const ok = confirm(`Are you sure you want to delete ${name}?`);

        if (!ok) return state;
        delete state.templates[name];
      }),
    clearTemplates: () =>
      set((state) => {
        const ok = confirm(
          'Are you sure you want to delete all the templates?',
        );
        if (!ok) return;
        state.templates = {};
      }),
  })),
);
