import { QueryClient } from "vue-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
})

export {
  renderComposable
} from './renderComposable'

export {
  setupClient
} from './utils'
