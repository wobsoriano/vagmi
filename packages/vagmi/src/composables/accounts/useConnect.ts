import type { ConnectArgs, ConnectResult } from '@wagmi/core';
import { Connector, connect } from '@wagmi/core';
import { computed, reactive } from 'vue';
import { useMutation } from 'vue-query';
import type { UseMutationOptions, UseMutationReturnType } from 'vue-query';
import { toRefs } from '@vueuse/core';

import { useClient } from '../../plugin';
import type { SetMaybeRef } from '../../types';
import { getMaybeRefValue } from '../../utils';

export type UseMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown,
> = UseMutationReturnType<TData, TError, TVariables, TContext>;

export type UseConnectArgs = Partial<ConnectArgs>;

type MutationOptions = UseMutationOptions<ConnectResult, Error, ConnectArgs, unknown>;

export interface UseConnectConfig {
  /** Chain to connect */
  chainId?: number
  /**
   * Function to invoke before connect and is passed same variables connect function would receive.
   * Value returned from this function will be passed to both onError and onSettled functions in event of a mutation failure.
   */
  onBeforeConnect?: MutationOptions['onMutate']
  /** Function to invoke when connect is successful. */
  onConnect?: MutationOptions['onSuccess']
  /** Function to invoke when an error is thrown while connecting. */
  onError?: MutationOptions['onError']
  /** Function to invoke when connect is settled (either successfully connected, or an error has thrown). */
  onSettled?: MutationOptions['onSettled']
}

export const mutationKey = (args: UseConnectArgs) => [
  { entity: 'connect', ...args },
];

const mutationFn = (args: UseConnectArgs) => {
  const { connector, chainId } = args;
  if (!connector)
    throw new Error('connector is required');
  return connect({ connector, chainId });
};

export function useConnect({
  chainId,
  connector,
  onBeforeConnect,
  onConnect,
  onError,
  onSettled,
}: SetMaybeRef<UseConnectArgs & UseConnectConfig> = {}) {
  const client = useClient();

  const options = reactive({
    mutationKey: computed(() => mutationKey({ connector: getMaybeRefValue(connector), chainId: getMaybeRefValue(chainId) })),
    mutationFn,
    onError,
    onMutate: onBeforeConnect,
    onSettled,
    onSuccess: onConnect,
  });

  const { data, error, mutate, mutateAsync, reset, status, variables }
    = useMutation(options);

  const connect = (connectorOrArgs?: Partial<ConnectArgs> | ConnectArgs['connector']) => {
    let config: Partial<ConnectArgs>;
    if (connectorOrArgs instanceof Connector) {
      const connector_ = connectorOrArgs;
      config = {
        chainId: getMaybeRefValue(chainId),
        connector: connector_ ?? getMaybeRefValue(connector),
      };
    }
    else {
      const args = connectorOrArgs;
      config = {
        chainId: args?.chainId ?? getMaybeRefValue(chainId),
        connector: args?.connector ?? getMaybeRefValue(connector),
      };
    }
    return mutate(<ConnectArgs>config);
  };

  const connectAsync = (connectorOrArgs?: Partial<ConnectArgs> | ConnectArgs['connector']) => {
    let config: Partial<ConnectArgs>;
    if (connectorOrArgs instanceof Connector) {
      const connector_ = connectorOrArgs;
      config = {
        chainId: getMaybeRefValue(chainId),
        connector: connector_ ?? getMaybeRefValue(connector),
      };
    }
    else {
      const args = connectorOrArgs;
      config = {
        chainId: args?.chainId ?? getMaybeRefValue(chainId),
        connector: args?.connector ?? getMaybeRefValue(connector),
      };
    }
    return mutateAsync(<ConnectArgs>config);
  };

  const status_ = computed(() => {
    let result:
    | Extract<UseMutationResult['status'], 'error' | 'idle'>
    | 'connected'
    | 'connecting'
    | 'disconnected'
    | 'reconnecting';

    if (client.value.status === 'reconnecting')
      result = 'reconnecting';
    else if (status.value === 'loading' || client.value.status === 'connecting')
      result = 'connecting';
    else if (client.value.connector)
      result = 'connected';
    else if (!client.value.connector || status.value === 'success')
      result = 'disconnected';
      // @ts-expect-error: TODO: Fix type
    else result = status.value;

    return result;
  });

  const result = computed(() => ({
    activeConnector: client.value.connector,
    connect,
    connectAsync,
    connectors: client.value.connectors,
    data: data.value,
    error: error.value,
    isConnected: status_.value === 'connected',
    isConnecting: status_.value === 'connecting',
    isDisconnected: status_.value === 'disconnected',
    isError: status.value === 'error',
    // @ts-expect-error: TODO: Fix type
    isIdle: status_.value === 'idle',
    isReconnecting: status_.value === 'reconnecting',
    pendingConnector: variables.value?.connector,
    reset,
    status: status_.value,
  }));

  return toRefs(result);
}
