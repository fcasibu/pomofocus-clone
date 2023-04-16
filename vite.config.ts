import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const reactPlugin = react({
  babel: {
    plugins: [
      ['babel-plugin-styled-components', { displayName: true, fileName: true }],
    ],
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactPlugin, tsconfigPaths()],
  base: '/pomofocus-clone/',
  build: {
    minify: 'terser',
  },
  preview: {
    port: 8080,
  },
});
