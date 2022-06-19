import { get } from '@vueuse/core';
import type {
  WaitForTransactionArgs,
  WaitForTransactionResult,
} from '@wagmi/core';
import {
  waitForTransaction,
} from '@wagmi/core';

import type { QueryConfig, QueryFunctionArgs } from '../../types';
import { useChainId, useQuery } from '../utils';

export type UseWaitForTransactionArgs = Partial<WaitForTransactionArgs>;

export type UseWaitForTransactionConfig = QueryConfig<
    WaitForTransactionResult,
    Error
  >;

export const queryKey = ({
  confirmations,
  chainId,
  hash,
  timeout,
  wait,
}: Partial<WaitForTransactionArgs>) =>
  [
    {
      entity: 'waitForTransaction',
      confirmations,
      chainId,
      hash,
      timeout,
      wait,
    },
  ] as const;

const queryFn = ({
  queryKey: [{ chainId, confirmations, hash, timeout, wait }],
}: QueryFunctionArgs<typeof queryKey>) => {
  return waitForTransaction({ chainId, confirmations, hash, timeout, wait });
};

export function useWaitForTransaction({
  chainId: chainId_,
  confirmations,
  hash,
  timeout,
  wait,
  cacheTime,
  enabled = true,
  staleTime,
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseWaitForTransactionArgs & UseWaitForTransactionConfig = {}) {
  const chainId = useChainId({ chainId: chainId_ });

  return useQuery(
    queryKey({ chainId: get(chainId), confirmations, hash, timeout, wait }),
    queryFn,
    {
      cacheTime,
      enabled: Boolean(enabled && (hash || wait)),
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess,
    },
  );
}
