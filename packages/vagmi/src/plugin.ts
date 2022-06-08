import type {
  ClientConfig,
  Provider,
  Client as VanillaClient,
  WebSocketProvider,
} from '@wagmi/core';
import {
  createClient as createVanillaClient,
} from '@wagmi/core';
import type {
  InjectionKey,
  Plugin,
  Ref,
} from 'vue';
import {
  inject,
  readonly,
  shallowRef,
  triggerRef,
} from 'vue';
import { QueryClient, VueQueryPlugin } from 'vue-query';

export type CreateClientConfig<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = ClientConfig<TProvider, TWebSocketProvider> & {
  queryClient?: QueryClient
};

export function createClient<
  TProvider extends Provider,
  TWebSocketProvider extends WebSocketProvider,
>({
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
        // TODO: uncomment when persistor becomes available
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        // TODO: uncomment when persistor becomes available
        networkMode: 'offlineFirst',
      },
    },
  }),
  ...config
}: CreateClientConfig<TProvider, TWebSocketProvider> = {}) {
  const client = createVanillaClient<TProvider, TWebSocketProvider>(config);
  // TODO: Add persistor when it becomes available
  return Object.assign(client, { queryClient });
}

export type Client<
  TProvider extends Provider = Provider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = VanillaClient<TProvider, TWebSocketProvider> & { queryClient: QueryClient };

export const VagmiClientKey: InjectionKey<Ref<Client>> = Symbol('vagmi');

export function VagmiPlugin(client = createClient()): Plugin {
  return {
    install(app) {
      // Setup vue-query
      app.use(VueQueryPlugin, {
        queryClient: client.queryClient,
      });

      const reactiveClient = shallowRef(client);

      // Setup @wagmi/core
      if (client.config.autoConnect)
        client.autoConnect();

      const unsubscribe = client.subscribe(() => {
        triggerRef(reactiveClient);
      });

      const originalUnmount = app.unmount;
      app.unmount = function vagmiUnmount() {
        unsubscribe();
        originalUnmount();
      };

      app.provide(VagmiClientKey, reactiveClient);
    },
  };
}

export function useClient() {
  const vagmiClient = inject(VagmiClientKey);
  if (!vagmiClient) {
    throw new Error(
      [
        '`useClient` must be used within `WagmiConfig`.\n',
        'Read more: https://wagmi.sh/docs/WagmiConfig',
      ].join('\n'),
    );
  }

  return vagmiClient;
}

export function useReadonlyClient(): Readonly<ReturnType<typeof useClient>> {
  const client = useClient();
  return readonly(client) as any;
}
