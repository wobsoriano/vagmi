import type { FetchFeeDataArgs, FetchFeeDataResult } from '@wagmi/core'
import { fetchFeeData } from '@wagmi/core'
import { computed, reactive, watch as vWatch } from 'vue'
import { useQuery } from 'vue-query'

import type { QueryConfig, QueryFunctionArgs, SetMaybeRef } from '../../types'
import { getMaybeRefValue } from '../../utils'
import { useBlockNumber } from '../network-status'
import { useChainId } from '../utils'

type UseFeeDataArgs = Partial<FetchFeeDataArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseFeedDataConfig = QueryConfig<FetchFeeDataResult, Error>

export const queryKey = ({
  chainId,
  formatUnits,
}: Partial<FetchFeeDataArgs> & {
  chainId?: number
}) => [{ entity: 'feeData', chainId, formatUnits }] as const

const queryFn = ({
  queryKey: [{ chainId, formatUnits }],
}: QueryFunctionArgs<typeof queryKey>) => {
  return fetchFeeData({ chainId, formatUnits })
}

export function useFeeData({
  cacheTime,
  chainId: chainId_,
  enabled = true,
  formatUnits = 'wei',
  staleTime,
  suspense,
  watch,
  onError,
  onSettled,
  onSuccess,
}: SetMaybeRef<UseFeeDataArgs & UseFeedDataConfig> = {}) {
  const chainId = useChainId({ chainId: chainId_ })

  const options = reactive({
    queryKey: computed(() => queryKey({ chainId: getMaybeRefValue(chainId), formatUnits: getMaybeRefValue(formatUnits) })),
    queryFn,
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  const feeDataQuery = useQuery(options)

  const { data: blockNumber } = useBlockNumber({ watch })

  vWatch(blockNumber, () => {
    if (!getMaybeRefValue(enabled))
      return
    if (!getMaybeRefValue(watch))
      return
    if (!getMaybeRefValue(blockNumber))
      return

    feeDataQuery.refetch.value()
  })

  return feeDataQuery
}
