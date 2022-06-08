import { QueryClient } from 'vue-query';
import type { nextTick as vueNextTick } from 'vue';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import waitFor from 'p-wait-for';
import { VagmiPlugin } from '../src';
import { setupClient } from './utils';

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
});

export interface RenderComposableResult<T> {
  result: T
  waitFor: typeof waitFor
  nextTick: typeof vueNextTick
}

export type MountOptions = Parameters<typeof mount>[1];

export function renderComposable<T>(
  composable: () => T,
  client = setupClient({ queryClient }),
): RenderComposableResult<T> {
  const Child = defineComponent({
    setup() {
      const result = composable();
      const wrapper = () => result;
      return { wrapper };
    },
    render: () => null,
  });

  const wrapper = mount({
    render: () => h(Child, { ref: 'child' }),
  }, {
    global: {
      plugins: [
        VagmiPlugin(client),
      ],
    },
  });

  return {
    result: (wrapper.vm.$refs.child as any).wrapper(),
    waitFor,
    nextTick: wrapper.vm.$nextTick,
  };
}

export {
  setupClient,
  actConnect,
  unrefAllProperties,
} from './utils';
