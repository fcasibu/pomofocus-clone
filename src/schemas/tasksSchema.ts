import * as yup from 'yup';

export const tasksSchema = yup.object({
  title: yup.string().required(),
  estimatedPomodoros: yup.number().required().min(1).default(1),
  note: yup.string(),
});
