import { TASKS_KEY } from '@constants';
import type { Immutable } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type Task = {
  id: string;
  title: string;
  finishedPomodoros: number;
  estimatedPomodoros: number;
  note: string;
  isFinished: boolean;
  isSelected: boolean;
};

export type TaskFormInput = Pick<
  Task,
  'title' | 'id' | 'note' | 'estimatedPomodoros'
>;

type TasksState = Immutable<{
  tasks: Task[];
  selectedTask?: Task | null;
}>;

type TasksActions = {
  addTasks(tasks: Task[]): void;
  addTask(task: TaskFormInput): void;
  deleteTask(id: string): void;
  editTask(id: string, updatedTask: TaskFormInput): void;
  toggleFinishTask(id: string): void;
  selectTask(id: string): void;
  incrementFinishedPomodoros(): void;
  countEstimatedPomodoros(): number;
  countFinishedPomodoros(): number;
  clear(type: string): void;
};

let initialState = {
  tasks: [],
  selectedTask: null,
};

try {
  initialState =
    JSON.parse(localStorage.getItem(TASKS_KEY) as string) ?? initialState;
} catch {
  localStorage.setItem(TASKS_KEY, JSON.stringify(initialState));
}

export const useTasksStore = create(
  immer<TasksState & TasksActions>((set, get) => ({
    ...initialState,
    addTasks: (tasks: Task[]) =>
      set((state) => {
        state.tasks.push(...tasks);
      }),
    addTask: (task: TaskFormInput) =>
      set((state) => {
        const val = {
          ...task,
          id: crypto.randomUUID(),
          isFinished: false,
          isSelected: state.tasks.length === 0,
          finishedPomodoros: 0,
        };

        if (state.tasks.length === 0) {
          state.selectedTask = val;
        }

        state.tasks.push(val);
      }),
    deleteTask: (id: string) =>
      set((state) => {
        state.tasks = state.tasks.filter((task) => {
          if (state.selectedTask?.id === id) {
            state.selectedTask = null;
          }
          return task.id !== id;
        });
      }),
    editTask: (id: string, updatedTask: TaskFormInput) =>
      set((state) => {
        state.tasks = state.tasks.map((task) => {
          return task.id === id ? Object.assign(task, updatedTask) : task;
        });
      }),
    toggleFinishTask: (id: string) =>
      set((state) => {
        state.tasks = state.tasks.map((task) => {
          return task.id === id
            ? Object.assign(task, { isFinished: !task.isFinished })
            : task;
        });
      }),
    selectTask: (id: string) =>
      set((state) => {
        state.tasks = state.tasks.map((task) => {
          if (task.id === id) {
            state.selectedTask = task;
            return Object.assign(task, { isSelected: true });
          }
          return Object.assign(task, { isSelected: false });
        });
      }),
    incrementFinishedPomodoros: () =>
      set((state) => {
        if (!state.selectedTask) return state;

        state.tasks = state.tasks.map((task) => {
          return state.selectedTask?.id === task.id
            ? Object.assign(task, {
                finishedPomodoros: task.finishedPomodoros + 1,
              })
            : task;
        });
      }),
    countEstimatedPomodoros: () =>
      get().tasks.reduce((acc, curr) => acc + curr.estimatedPomodoros, 0),
    countFinishedPomodoros: () =>
      get().tasks.reduce((acc, curr) => acc + curr.finishedPomodoros, 0),
    clear: (type: string) =>
      set((state) => {
        switch (type) {
          case 'CLEAR_ALL_TASKS': {
            state.tasks = [];
            state.selectedTask = null;
            break;
          }
          case 'CLEAR_FINISHED_TASKS': {
            const tasksLen = state.tasks.length;
            state.tasks = state.tasks.filter((task) => !task.isFinished);
            state.selectedTask =
              tasksLen !== state.tasks.length ? null : state.selectedTask;
            break;
          }
          default: {
            throw new Error(`Unexpected type: ${type}`);
          }
        }
      }),
  })),
);
