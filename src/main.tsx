import { ErrorBoundary } from '@components';
import { TimerProvider } from '@context';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import './index.css';

const App = React.lazy(() => import('./App'));

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/signup',
    element: <div>Hello</div>,
  },
]);

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

a {
  text-decoration: none;
}
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles />
    <TimerProvider>
      <HelmetProvider>
        <React.Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </React.Suspense>
      </HelmetProvider>
    </TimerProvider>
  </React.StrictMode>,
);
