import type { GetWebSocketProviderArgs } from '@wagmi/core';
import {
  getWebSocketProvider,
  watchWebSocketProvider,
} from '@wagmi/core';

import { ref, watchEffect } from 'vue';
import { getMaybeRefValue } from '../../utils';
import type { SetMaybeRef } from '../../types';

export type UseWebSocketProviderArgs = SetMaybeRef<Partial<GetWebSocketProviderArgs>>;

export function useWebSocketProvider({ chainId }: UseWebSocketProviderArgs = {}): any {
  const initialValue = getMaybeRefValue(chainId);
  const webSocketProvider = ref(
    getWebSocketProvider({ chainId: initialValue }),
  );

  watchEffect((onInvalidate) => {
    const unwatch = watchWebSocketProvider(
      { chainId: getMaybeRefValue(chainId) },
      (webSocketProvider_) => {
        webSocketProvider.value = webSocketProvider_;
      },
    );

    onInvalidate(() => {
      unwatch();
    });
  });

  return webSocketProvider;
}
