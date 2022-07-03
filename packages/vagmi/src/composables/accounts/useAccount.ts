import type { GetAccountResult } from '@wagmi/core';
import { getAccount, watchAccount } from '@wagmi/core';
import { toRefs, tryOnScopeDispose } from '@vueuse/core';
import { ref, watchEffect } from 'vue';
import { useClient } from '../../plugin';

export interface UseAccountConfig {
  /** Function to invoke when connected */
  onConnect?({
    address,
    connector,
    isReconnected,
  }: {
    address?: GetAccountResult['address']
    connector?: GetAccountResult['connector']
    isReconnected: boolean
  }): void
  /** Function to invoke when disconnected */
  onDisconnect?(): void
}

export function useAccount({
  onConnect,
  onDisconnect,
}: UseAccountConfig = {}) {
  const client = useClient();

  const initialState = getAccount();
  const account = ref(initialState);

  const unwatch = watchAccount((data) => {
    account.value = data;
  });

  tryOnScopeDispose(() => {
    unwatch();
  });

  watchEffect((onInvalidate) => {
    // No need to subscribe if these callbacks aren't defined
    if (!onConnect && !onDisconnect)
      return;

    // Trigger update when status changes
    const unsubscribe = client.value.subscribe(
      state => state.status,
      (status, prevStatus) => {
        if (!!onConnect && status === 'connected') {
          const { address, connector } = getAccount();
          onConnect({
            address,
            connector,
            isReconnected: prevStatus === 'reconnecting',
          });
        }

        if (
          !!onDisconnect
          && prevStatus !== 'connecting'
          && status === 'disconnected'
        )
          onDisconnect();
      },
    );

    onInvalidate(unsubscribe);
  });

  return toRefs(account);
}
