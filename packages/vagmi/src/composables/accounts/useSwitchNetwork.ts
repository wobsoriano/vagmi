import type {
  SwitchNetworkArgs,
  SwitchNetworkResult,
} from '@wagmi/core';
import {
  switchNetwork,
} from '@wagmi/core';
import { computed, reactive } from 'vue';
import { useMutation } from 'vue-query';

import { useClient } from '../../plugin';
import type { MutationConfig, SetMaybeRef } from '../../types';
import { getMaybeRefValue } from '../../utils';

export type UseNetworkArgs = Partial<SwitchNetworkArgs>;

export type UseNetworkConfig = MutationConfig<
  SwitchNetworkResult,
  Error,
  SwitchNetworkArgs
>;

export const mutationKey = (args: UseNetworkArgs) => [
  { entity: 'switchNetwork', ...args },
];

const mutationFn = (args: UseNetworkArgs) => {
  const { chainId } = args;
  if (!chainId)
    throw new Error('chainId is required');
  return switchNetwork({ chainId });
};

export function useSwitchNetwork({
  chainId,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: SetMaybeRef<UseNetworkArgs & UseNetworkConfig> = {}) {
  const client = useClient();

  const options = reactive({
    mutationKey: computed(() => mutationKey({ chainId: getMaybeRefValue(chainId) })),
    mutationFn,
    onError,
    onMutate,
    onSettled,
    onSuccess,
  });

  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables,
  } = useMutation(options);

  const switchNetwork_ = (chainId_?: SwitchNetworkArgs['chainId']) =>
    mutate(<SwitchNetworkArgs>{ chainId: chainId_ ?? getMaybeRefValue(chainId) });

  const switchNetworkAsync_ = (chainId_?: SwitchNetworkArgs['chainId']) =>
    mutateAsync(<SwitchNetworkArgs>{ chainId: chainId_ ?? getMaybeRefValue(chainId) });

  const connector = computed(() => client.value.connector);

  return {
    chains: computed(() => client.value.chains ?? []),
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    pendingChainId: computed(() => variables.value?.chainId),
    reset,
    status,
    switchNetwork: computed(() => connector.value?.switchChain ? switchNetwork_ : undefined),
    switchNetworkAsync: computed(() => connector.value?.switchChain
      ? switchNetworkAsync_
      : undefined),
    variables,
  } as const;
}
