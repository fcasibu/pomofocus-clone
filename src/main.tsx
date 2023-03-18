import { ErrorBoundary } from '@components';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import './index.css';

const App = React.lazy(() => import('./App'));
const Loading = React.lazy(() => import('@components/Loading/Loading'));

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
    <HelmetProvider>
      <React.Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </React.Suspense>
    </HelmetProvider>
  </React.StrictMode>,
);
