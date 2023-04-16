export function getTime(totalSeconds: number, hourFormat: '24' | '12') {
  const totalHours = totalSeconds / 60 / 60;

  const now = new Date();

  const targetTime = new Date(now.getTime() + totalHours * 60 * 60 * 1000);

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: hourFormat === '12',
  };
  const formattedTime = targetTime.toLocaleString('en-US', options);

  return {
    formattedTime,
    diff: Math.round((totalHours + Number.EPSILON) * 10) / 10,
  };
}
