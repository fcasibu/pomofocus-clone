import { padWithZeroes } from './zeroPad';

export function getTime(totalSeconds: number, hourFormat: '24' | '12') {
  const totalHours = totalSeconds / 60 / 60;

  const now = new Date();

  console.log(totalHours);

  const targetTime = new Date(now.getTime() + totalHours * 60 * 60 * 1000);
  let formattedTime: string;
  const minutes = padWithZeroes(targetTime.getMinutes());

  if (hourFormat === '24') {
    const hours = padWithZeroes(targetTime.getHours());
    formattedTime =
      targetTime.getHours() === 24 ? `00:${minutes}` : `${hours}:${minutes}`;
  } else {
    const hours = padWithZeroes(targetTime.getHours() % 12 || 12);
    const period = targetTime.getHours() >= 12 ? 'PM' : 'AM';
    formattedTime = `${hours}:${minutes} ${period}`;
  }

  return { formattedTime, diff: totalHours.toFixed(1) };
}
