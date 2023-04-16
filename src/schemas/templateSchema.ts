import * as yup from 'yup';

export const templateSchema = yup.object({
  name: yup.string().min(1),
});
