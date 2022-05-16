import type { FetchBalanceArgs, FetchBalanceResult } from '@wagmi/core'
import { fetchBalance } from '@wagmi/core'
import { computed, reactive, watch as vWatch } from 'vue'
import { useQuery } from 'vue-query'

import type { QueryConfig, QueryFunctionArgs, SetMaybeRef } from '../../types'
import { getMaybeRefValue } from '../../utils'
import { useBlockNumber } from '../network-status'
import { useChainId } from '../utils'

export type UseBalanceArgs = Partial<FetchBalanceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseBalanceConfig = QueryConfig<FetchBalanceResult, Error>

export const queryKey = ({
  addressOrName,
  chainId,
  formatUnits,
  token,
}: Partial<FetchBalanceArgs> & {
  chainId?: number
}) =>
  [{ entity: 'balance', addressOrName, chainId, formatUnits, token }] as const

const queryFn = ({
  queryKey: [{ addressOrName, chainId, formatUnits, token }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!addressOrName)
    throw new Error('address is required')
  return fetchBalance({ addressOrName, chainId, formatUnits, token })
}

export function useBalance({
  addressOrName,
  cacheTime,
  chainId: chainId_,
  enabled = true,
  formatUnits = 'ether',
  staleTime,
  suspense,
  token,
  watch,
  onError,
  onSettled,
  onSuccess,
}: SetMaybeRef<UseBalanceArgs & UseBalanceConfig> = {}) {
  const chainId = useChainId({ chainId: chainId_ })
  const options = reactive({
    queryKey: computed(() => queryKey({
      addressOrName: getMaybeRefValue(addressOrName),
      chainId: getMaybeRefValue(chainId),
      formatUnits: getMaybeRefValue(formatUnits),
      token: getMaybeRefValue(token),
    })),
    queryFn,
    cacheTime,
    enabled: computed(() => Boolean(getMaybeRefValue(enabled) && getMaybeRefValue(addressOrName))),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
  const balanceQuery = useQuery(options)

  const { data: blockNumber } = useBlockNumber({ watch })

  vWatch(blockNumber, () => {
    if (!getMaybeRefValue(enabled))
      return
    if (!getMaybeRefValue(watch))
      return
    if (!getMaybeRefValue(blockNumber))
      return
    if (!getMaybeRefValue(addressOrName))
      return

    balanceQuery.refetch.value()
  })

  return balanceQuery
}
