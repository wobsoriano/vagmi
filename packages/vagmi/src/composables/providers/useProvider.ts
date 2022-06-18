import type { providers } from 'ethers';
import type { GetProviderArgs } from '@wagmi/core';
import { getProvider, watchProvider } from '@wagmi/core';

import { markRaw, readonly, ref, watchEffect } from 'vue';
import type { SetMaybeRef } from '../../types';
import { getMaybeRefValue } from '../../utils';

export type UseProviderArgs = SetMaybeRef<Partial<GetProviderArgs>>;

export function useProvider<TProvider extends providers.BaseProvider>({
  chainId,
}: UseProviderArgs = {}) {

  const provider = ref(markRaw(getProvider<TProvider>({ chainId: getMaybeRefValue(chainId) })));

  watchEffect((onInvalidate) => {
    const unwatch = watchProvider<TProvider>({ chainId: getMaybeRefValue(chainId) }, (provider_) => {
      provider.value = markRaw(provider_);
    });

    onInvalidate(() => {
      unwatch();
    });
  });

  return readonly(provider);
}
