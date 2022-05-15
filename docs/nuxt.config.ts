import { defineNuxtConfig } from 'nuxt'
import colors from 'tailwindcss/colors.js'

export default defineNuxtConfig({
  generate: {
    routes: [],
  },
  extends: ['./node_modules/@docus/docs-theme'],
  github: {
    repo: 'wobsoriano/vagmi',
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
})
