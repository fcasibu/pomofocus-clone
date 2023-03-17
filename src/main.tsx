import { ErrorBoundary } from '@components';
import { ConfigProvider, TimerProvider } from '@context';
import { ModalProvider } from '@context/ModalProvider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import './index.css';

const App = React.lazy(() => import('./App'));

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorBoundary />,
    },
  ],
  { basename: '/pomofocus-clone' },
);

const GlobalStyles = createGlobalStyle`
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body,
html,
#root {
  height: 100%;
}

body {
  overflow: auto;
}

a {
  text-decoration: none;
}
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles />
    <ConfigProvider>
      <TimerProvider>
        <HelmetProvider>
          <ModalProvider>
            <React.Suspense fallback={<div>Loading...</div>}>
              <RouterProvider router={router} />
            </React.Suspense>
          </ModalProvider>
        </HelmetProvider>
      </TimerProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
