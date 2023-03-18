import { Alarm_Analog } from '@assets';
import { colors } from '@utils';
import * as yup from 'yup';

export const configSchema = yup.object({
  timer: yup.object({
    time: yup
      .object({
        POMO: yup.number().min(0.1).required(),
        SHORT: yup.number().min(0.1).required(),
        LONG: yup.number().min(0.1).required(),
      })
      .required(),
    longBreakInterval: yup.number().min(1).required(),
    autoStartPomo: yup.boolean(),
    autoStartBreaks: yup.boolean(),
  }),
  sound: yup.object({
    alarm: yup.object({
      gain: yup.number().default(0.5),
      sound: yup.string().default(Alarm_Analog),
    }),
  }),
  theme: yup.object({
    colorThemes: yup.object({
      POMO: yup.string().default(colors.RED),
      SHORT: yup.string().default(colors.TEAL),
      LONG: yup.string().default(colors.LIGHT_BLUE),
    }),
    hourFormat: yup.string().default('12'),
  }),
});
