import { ONE_SECOND } from '@constants';

export const notify = (message: string) => {
  if (!('Notification' in window)) return;

  Notification.requestPermission((permission) => {
    if (permission === 'granted') {
      const notification = new Notification('Pomofocus', {
        body: message,
        icon: import.meta.env.BASE_URL + 'vite.svg',
      });

      const timeout = setTimeout(() => {
        notification.close();
      }, ONE_SECOND * 5);

      notification.onclose = () => {
        clearTimeout(timeout);
      };
    }
  });
};
