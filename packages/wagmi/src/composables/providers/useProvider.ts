import type { providers } from 'ethers'
import type { GetProviderArgs } from '@wagmi/core'
import { getProvider, watchProvider } from '@wagmi/core'
import { klona } from 'klona/json'

import { readonly, ref, watchEffect } from 'vue'
import type { SetMaybeRef } from '../../types'
import { getMaybeRefValue } from '../../utils'

export type UseProviderArgs = SetMaybeRef<Partial<GetProviderArgs>>

export function useProvider<TProvider extends providers.BaseProvider>({
  chainId,
}: UseProviderArgs = {}) {
  const provider = ref(klona(getProvider<TProvider>({ chainId: getMaybeRefValue(chainId) })))

  watchEffect((onInvalidate) => {
    const unwatch = watchProvider<TProvider>({ chainId: getMaybeRefValue(chainId) }, (provider_) => {
      provider.value = klona(provider_)
    })

    onInvalidate(() => {
      unwatch()
    })
  })

  return readonly(provider)
}
