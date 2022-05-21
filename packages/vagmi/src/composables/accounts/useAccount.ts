import type { GetAccountResult } from '@wagmi/core'
import { getAccount, watchAccount } from '@wagmi/core'
import { useQuery, useQueryClient } from 'vue-query'
import type { UseQueryOptions } from 'vue-query'
import { tryOnScopeDispose } from '@vueuse/core'

export type UseAccountConfig = Pick<
  UseQueryOptions<GetAccountResult, Error>,
  'suspense' | 'onError' | 'onSettled' | 'onSuccess'
>

export const queryKey = () => [{ entity: 'account' }] as const

const queryFn = () => {
  const result = getAccount()
  if (result.address)
    return result
  return null
}

export function useAccount({
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseAccountConfig = {}) {
  const queryClient = useQueryClient()

  const accountQuery = useQuery(queryKey(), queryFn, {
    staleTime: 0,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  const unwatch = watchAccount((data) => {
    // TODO: Fix reactivity
    queryClient.setQueryData(queryKey(), data?.address
      ? data
      : {
          address: null,
          connector: null,
        })
    accountQuery.refetch()
  })

  tryOnScopeDispose(() => {
    unwatch()
  })

  return accountQuery
}
