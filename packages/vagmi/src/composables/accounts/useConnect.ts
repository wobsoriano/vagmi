import type { ConnectArgs, ConnectResult } from '@wagmi/core'
import { connect } from '@wagmi/core'
import { computed, reactive } from 'vue'
import { useMutation } from 'vue-query'
import type { UseMutationOptions, UseMutationResult } from 'vue-query/types'
import { toRefs } from '@vueuse/core'

import { useClient } from '../../plugin'
import type { SetMaybeRef } from '../../types'
import { getMaybeRefValue } from '../../utils'

export type UseConnectArgs = Partial<ConnectArgs>

type MutationOptions = UseMutationOptions<ConnectResult, Error, ConnectArgs, unknown>
export interface UseConnectConfig {
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
]

const mutationFn = (args: UseConnectArgs) => {
  const { connector } = args
  if (!connector)
    throw new Error('connector is required')
  return connect({ connector })
}

export function useConnect({
  connector,
  onBeforeConnect,
  onConnect,
  onError,
  onSettled,
}: SetMaybeRef<UseConnectArgs & UseConnectConfig> = {}) {
  const client = useClient()

  const options = reactive({
    mutationKey: computed(() => mutationKey({ connector: getMaybeRefValue(connector) })),
    mutationFn,
    onError,
    onMutate: onBeforeConnect,
    onSettled,
    onSuccess: onConnect,
  })

  const { data, error, mutate, mutateAsync, reset, status, variables }
    = useMutation(options)

  const connect = computed(() => {
    return (connector_?: ConnectArgs['connector']) =>
      mutate(<ConnectArgs>{ connector: connector_ ?? getMaybeRefValue(connector) })
  })

  const connectAsync = computed(() => {
    return (connector_?: ConnectArgs['connector']) =>
      mutateAsync(<ConnectArgs>{ connector: connector_ ?? getMaybeRefValue(connector) })
  })

  const status_ = computed(() => {
    let result:
    | Extract<UseMutationResult['status'], 'error' | 'idle'>
    | 'connected'
    | 'connecting'
    | 'disconnected'
    | 'reconnecting'

    if (client.status === 'reconnecting')
      result = 'reconnecting'
    else if (status.value === 'loading' || client.status === 'connecting')
      result = 'connecting'
    else if (client.connector)
      result = 'connected'
    else if (!client.connector || status.value === 'success')
      result = 'disconnected'
    else result = status.value

    return result
  })

  const result = computed(() => ({
    activeConnector: client.connector,
    connect: connect.value,
    connectAsync: connectAsync.value,
    connectors: client.connectors,
    data: data.value,
    error: error.value,
    isConnected: status_.value === 'connected',
    isConnecting: status_.value === 'connecting',
    isDisconnected: status_.value === 'disconnected',
    isError: status.value === 'error',
    isIdle: status_.value === 'idle',
    isReconnecting: status_.value === 'reconnecting',
    pendingConnector: variables.value?.connector,
    reset: reset.value,
    status: status_.value,
  }))

  return toRefs(result)
}
