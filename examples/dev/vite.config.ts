import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import stdLibBrowser from 'node-stdlib-browser';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      ...inject({
        global: [
          require.resolve(
            'node-stdlib-browser/helpers/esbuild/shim',
          ),
          'global',
        ],
        process: [
          require.resolve(
            'node-stdlib-browser/helpers/esbuild/shim',
          ),
          'process',
        ],
        Buffer: [
          require.resolve(
            'node-stdlib-browser/helpers/esbuild/shim',
          ),
          'Buffer',
        ],
      }),
      enforce: 'post',
    },
  ],
  resolve: {
    alias: stdLibBrowser,
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  build: {
    chunkSizeWarningLimit: 4000,
  },
});
