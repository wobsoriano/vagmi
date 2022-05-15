import type { providers } from 'ethers'
import type {
  WagmiClient,
  ClientConfig as WagmiClientConfig,
} from '@wagmi/core'
import {
  createClient as createWagmiClient,
} from '@wagmi/core'
import type {
  InjectionKey,
  Plugin,
} from 'vue'
import {
  inject,
} from 'vue'
import { QueryClient, VueQueryPlugin } from 'vue-query'

export type DecoratedWagmiClient<
  TProvider extends providers.BaseProvider = providers.BaseProvider,
  TWebSocketProvider extends providers.WebSocketProvider = providers.WebSocketProvider,
> = WagmiClient<TProvider, TWebSocketProvider> & { queryClient: QueryClient }

export type ClientConfig<
  TProvider extends providers.BaseProvider = providers.BaseProvider,
  TWebSocketProvider extends providers.WebSocketProvider = providers.WebSocketProvider,
> = WagmiClientConfig<TProvider, TWebSocketProvider> & {
  queryClient?: QueryClient
}

export function createClient<
  TProvider extends providers.BaseProvider,
  TWebSocketProvider extends providers.WebSocketProvider,
>({
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
        // TODO: uncomment when persistor becomes available
        // networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        // TODO: uncomment when persistor becomes available
        // networkMode: 'offlineFirst',
      },
    },
  }),
  ...config
}: ClientConfig<TProvider, TWebSocketProvider> = {}) {
  const client = createWagmiClient<TProvider, TWebSocketProvider>(config)
  // TODO: Add persistor when it becomes available
  return Object.assign(client, { queryClient })
}

export const VagmiClientKey: InjectionKey<DecoratedWagmiClient> = Symbol('wagmi')

export function updateState(
  state: Record<string, unknown>,
  update: Record<string, any>,
): void {
  Object.keys(state).forEach((key) => {
    state[key] = update[key]
  })
}

export function VagmiPlugin(client = createClient()): Plugin {
  return {
    install(app) {
      // Setup vue-query
      app.use(VueQueryPlugin, {
        queryClient: client.queryClient,
      })

      // Setup @wagmi/core
      if (client.config.autoConnect)
        client.autoConnect()

      app.provide(VagmiClientKey, client)
    },
  }
}

export function useClient() {
  const wagmiClient = inject(VagmiClientKey)
  if (!wagmiClient)
    throw new Error('Must be used within VueWagmiPlugin')

  return wagmiClient
}
