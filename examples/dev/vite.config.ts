import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { env, nodeless } from 'unenv'

const { alias } = env(nodeless)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { buffer: _, ...rest } = alias

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      ...rest,
    },
  },
})
