import { tryOnScopeDispose } from '@vueuse/core'
import type {
  SwitchNetworkArgs,
  SwitchNetworkResult,
} from '@wagmi/core'
import {
  getNetwork,
  switchNetwork,
  watchNetwork,
} from '@wagmi/core'
import { computed, reactive, ref } from 'vue'
import { useMutation } from 'vue-query'

import { useClient } from '../../plugin'
import type { MutationConfig, SetMaybeRef } from '../../types'
import { getMaybeRefValue } from '../../utils'

export type UseNetworkArgs = Partial<SwitchNetworkArgs>

export type UseNetworkConfig = MutationConfig<
  SwitchNetworkResult,
  Error,
  SwitchNetworkArgs
>

export const mutationKey = (args: UseNetworkArgs) => [
  { entity: 'switchNetwork', ...args },
]

const mutationFn = (args: UseNetworkArgs) => {
  const { chainId } = args
  if (!chainId)
    throw new Error('chainId is required')
  return switchNetwork({ chainId: getMaybeRefValue(chainId)! })
}

export function useNetwork({
  chainId,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: SetMaybeRef<UseNetworkArgs> & UseNetworkConfig = {}) {
  const network = ref(getNetwork())

  const client = useClient()

  const connector = client.connector

  const options = reactive({
    mutationKey: computed(() => mutationKey({ chainId: getMaybeRefValue(chainId) })),
    mutationFn,
    onError,
    onMutate,
    onSettled,
    onSuccess,
  })

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation(options)

  const unwatch = watchNetwork((data) => {
    network.value = data
  })

  tryOnScopeDispose(() => {
    unwatch()
  })

  const switchNetwork_ = computed(() => {
    return (chainId_?: SwitchNetworkArgs['chainId']) =>
      mutate(<SwitchNetworkArgs>{ chainId: chainId_ ?? getMaybeRefValue(chainId) })
  })

  const switchNetworkAsync_ = computed(() => {
    return (chainId_?: SwitchNetworkArgs['chainId']) =>
      mutateAsync(<SwitchNetworkArgs>{ chainId: chainId_ ?? getMaybeRefValue(chainId) })
  })

  return {
    activeChain: computed(() => network.value.chain),
    chains: computed(() => network.value.chains ?? []),
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    pendingChainId: computed(() => variables.value?.chainId),
    reset,
    status,
    switchNetwork: computed(() => connector?.switchChain ? switchNetwork_.value : undefined),
    switchNetworkAsync: computed(() => connector?.switchChain
      ? switchNetworkAsync_.value
      : undefined),
    variables,
  } as const
}
