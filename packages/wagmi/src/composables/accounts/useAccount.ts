import type { GetAccountResult } from '@wagmi/core'
import { getAccount, watchAccount } from '@wagmi/core'
import { useQuery, useQueryClient } from 'vue-query'
import type { UseQueryOptions } from 'vue-query'
import { onScopeDispose, reactive } from 'vue'

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

  const options = reactive({
    queryKey: queryKey(),
    queryFn,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  const accountQuery = useQuery(options)

  const unwatch = watchAccount((data) => {
    queryClient.setQueryData(queryKey(), data?.address ? data : null)
  })

  onScopeDispose(unwatch)

  return accountQuery
}
