import type { FetchSignerResult } from '@wagmi/core';
import { fetchSigner, watchSigner } from '@wagmi/core';
import { useQueryClient } from 'vue-query';
import { tryOnScopeDispose } from '@vueuse/core';

import type { QueryConfig } from '../../types';
import { useQuery } from '../utils';

export type UseSignerConfig = Omit<
  QueryConfig<FetchSignerResult, Error>,
  'cacheTime' | 'staleTime' | 'enabled' | 'suspense'
>;

export const queryKey = () => [{ entity: 'signer' }] as const;

const queryFn = () => fetchSigner();

export function useSigner({
  onError,
  onSettled,
  onSuccess,
}: UseSignerConfig = {}) {
  const signerQuery = useQuery(queryKey(), queryFn, {
    cacheTime: 0,
    staleTime: 0,
    onError,
    onSettled,
    onSuccess,
  });

  const queryClient = useQueryClient();
  const unwatch = watchSigner(signer =>
    queryClient.setQueryData(queryKey(), signer),
  );

  tryOnScopeDispose(() => {
    unwatch();
  });

  return signerQuery;
}
