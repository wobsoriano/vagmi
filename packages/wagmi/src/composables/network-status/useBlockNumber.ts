import { useQueryClient, useQuery } from 'vue-query'
import {
  FetchBlockNumberArgs,
  FetchBlockNumberResult,
  fetchBlockNumber,
} from '@wagmi/core'

import { QueryConfig, SetMaybeRef, QueryFunctionArgs } from '../../types'
import { useProvider, useWebSocketProvider } from '../providers'
import { useChainId } from '../utils'
import { computed, reactive, watchEffect } from 'vue'
import { getMaybeRefValue } from '../../utils'

type UseBlockNumberArgs = Partial<FetchBlockNumberArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseBlockNumberConfig = QueryConfig<FetchBlockNumberResult, Error>

export const queryKey = ({ chainId }: { chainId?: number }) =>
  [{ entity: 'blockNumber', chainId }] as const

const queryFn = ({
  queryKey: [{ chainId }],
}: QueryFunctionArgs<typeof queryKey>) => {
  return fetchBlockNumber({ chainId })
}

export function useBlockNumber({
  cacheTime = 0,
  chainId: chainId_,
  enabled = true,
  staleTime,
  suspense,
  watch = false,
  onError,
  onSettled,
  onSuccess,
}: SetMaybeRef<UseBlockNumberArgs> & UseBlockNumberConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })
  const provider = useProvider()
  const webSocketProvider = useWebSocketProvider()
  const queryClient = useQueryClient()

  watchEffect((onInvalidate) => {
    if (!getMaybeRefValue(watch)) return

    const listener = (blockNumber: number) => {
      // Just to be safe in case the provider implementation
      // calls the event callback after .off() has been called
      queryClient.setQueryData(queryKey({ chainId: getMaybeRefValue(chainId) }), blockNumber)
    }

    const provider_ = webSocketProvider ?? provider
    provider_.on('block', listener) 

    onInvalidate(() => {
      provider_.off('block', listener)
    })
  })

  const options = reactive({
    queryKey: computed(() => queryKey({ chainId: getMaybeRefValue(chainId) })),
    queryFn,
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  return useQuery(options)
}
