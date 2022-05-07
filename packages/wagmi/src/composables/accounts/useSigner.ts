import type { FetchSignerResult } from '@wagmi/core'
import { fetchSigner, watchSigner } from '@wagmi/core'
import { onScopeDispose } from 'vue'
import { useQuery, useQueryClient } from 'vue-query'

import type { QueryConfig } from '../../types'

export type UseSignerConfig = Omit<
  QueryConfig<FetchSignerResult, Error>,
  'cacheTime' | 'staleTime' | 'enabled'
>

export const queryKey = () => [{ entity: 'signer' }] as const

const queryFn = () => fetchSigner()

export function useSigner({
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseSignerConfig = {}) {
  const signerQuery = useQuery(queryKey(), queryFn, {
    cacheTime: 0,
    staleTime: 0,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  const queryClient = useQueryClient()

  const unwatch = watchSigner(signer =>
    queryClient.setQueryData(queryKey(), signer),
  )

  onScopeDispose(() => {
    unwatch()
  })

  return signerQuery
}
