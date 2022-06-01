import { defineNuxtConfig } from 'nuxt'
import colors from 'tailwindcss/colors.js'

export default defineNuxtConfig({
  extends: ['./node_modules/@docus/docs-theme'],
  github: {
    repo: 'wobsoriano/vagmi',
  },
  vite: {
    define: {
      'process.env.FORCE_COLOR': {},
      'process.env.NODE_DISABLE_COLORS': {},
      'process.env.NO_COLOR': {},
      'process.env.FORCE_TERM': {},
    },
  },
  colorMode: {
    preference: 'dark',
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: colors.emerald,
          },
        },
      },
    },
  },
  theme: {}
})
