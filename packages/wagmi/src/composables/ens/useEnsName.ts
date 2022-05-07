import type { FetchEnsNameArgs, FetchEnsNameResult } from '@wagmi/core'
import { fetchEnsName } from '@wagmi/core'
import type { UseQueryOptions } from 'vue-query'
import { useQuery } from 'vue-query'

import { computed, reactive } from 'vue'
import type { QueryFunctionArgs, SetMaybeRef } from '../../types'
import { getMaybeRefValue } from '../../utils'
import { useChainId } from '../utils'

export type UseEnsNameArgs = SetMaybeRef<Partial<FetchEnsNameArgs>>

export type UseEnsNameConfig = UseQueryOptions<FetchEnsNameResult, Error>

export const queryKey = ({
  address,
  chainId,
}: {
  address?: string
  chainId?: number
}) => [{ entity: 'ensName', address, chainId }] as const

const queryFn = ({
  queryKey: [{ address }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!getMaybeRefValue(address))
    throw new Error('address is required')
  return fetchEnsName({ address: getMaybeRefValue(address)! })
}

export function useEnsName({
  address,
  cacheTime,
  chainId: chainId_,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseEnsNameArgs & UseEnsNameConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  const options = reactive({
    queryKey: queryKey({ address: getMaybeRefValue(address), chainId: getMaybeRefValue(chainId) }),
    queryFn,
    cacheTime,
    enabled: computed(() => Boolean(getMaybeRefValue(enabled) && getMaybeRefValue(address) && getMaybeRefValue(chainId))),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  return useQuery(options)
}
