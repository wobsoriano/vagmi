import { computed } from 'vue';
import type { SetMaybeRef } from '../../types';
import { useProvider } from '../providers';

export type UseChainIdArgs = SetMaybeRef<{
  chainId?: number
}>;

export function useChainId({ chainId }: UseChainIdArgs = {}) {
  const provider = useProvider({ chainId });
  return computed(() => provider.value?.network?.chainId);
}
