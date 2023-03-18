import { ErrorBoundary, Loading } from '@components';
import { StrictMode, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import './index.css';

const App = lazy(() => import('./App'));

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
  <StrictMode>
    <GlobalStyles />
    <HelmetProvider>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </HelmetProvider>
  </StrictMode>,
);
