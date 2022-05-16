import type {
  FetchEnsAvatarArgs,
  FetchEnsAvatarResult,
} from '@wagmi/core'
import {
  fetchEnsAvatar,
} from '@wagmi/core'
import { computed, reactive } from 'vue'
import { useQuery } from 'vue-query'

import type { QueryConfig, QueryFunctionArgs, SetMaybeRef } from '../../types'
import { getMaybeRefValue } from '../../utils'
import { useChainId } from '../utils'

export type UseEnsAvatarArgs = Partial<FetchEnsAvatarArgs>

export type UseEnsLookupConfig = QueryConfig<FetchEnsAvatarResult, Error>

export const queryKey = ({
  addressOrName,
  chainId,
}: {
  addressOrName?: UseEnsAvatarArgs['addressOrName']
  chainId?: number
}) => [{ entity: 'ensAvatar', addressOrName, chainId }] as const

const queryFn = ({
  queryKey: [{ addressOrName, chainId }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!addressOrName)
    throw new Error('addressOrName is required')
  return fetchEnsAvatar({ addressOrName, chainId })
}

export function useEnsAvatar({
  addressOrName,
  cacheTime,
  chainId: chainId_,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: SetMaybeRef<UseEnsAvatarArgs & UseEnsLookupConfig> = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  const options = reactive({
    queryKey: computed(() => queryKey({ chainId: getMaybeRefValue(chainId), addressOrName: getMaybeRefValue(addressOrName) })),
    queryFn,
    cacheTime,
    enabled: computed(() => {
      return Boolean(getMaybeRefValue(enabled) && getMaybeRefValue(addressOrName) && getMaybeRefValue(chainId))
    }),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  return useQuery(options)
}
