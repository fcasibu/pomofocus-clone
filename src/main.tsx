import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import App from './App';
import { ErrorBoundary } from '@components';
import { colors } from '@utils';
import './index.css';
import { TimerProvider } from '@context';

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

const theme = {
  bg: colors.RED,
  text: colors.WHITE,
};

const S = {
  Container: styled.div`
    background-color: ${(props) => props.theme.bg};
    height: 100%;
  `,
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <S.Container>
        <TimerProvider>
          <RouterProvider router={router} />
        </TimerProvider>
      </S.Container>
    </ThemeProvider>
  </React.StrictMode>,
);
