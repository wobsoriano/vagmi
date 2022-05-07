import type { SignMessageArgs, SignMessageResult } from '@wagmi/core'
import { signMessage } from '@wagmi/core'
import { computed, reactive } from 'vue'
import { useMutation } from 'vue-query'

import type { MutationConfig, SetMaybeRef } from '../../types'
import { getMaybeRefValue } from '../../utils'

export type UseSignMessageArgs = Partial<SignMessageArgs>

export type UseSignMessageConfig = MutationConfig<
  SignMessageResult,
  Error,
  SignMessageArgs
>

export const mutationKey = (args: UseSignMessageArgs) => [
  { entity: 'signMessage', ...args },
]

const mutationFn = (args: UseSignMessageArgs) => {
  const { message } = args
  if (!message)
    throw new Error('message is required')
  return signMessage({ message })
}

export function useSignMessage({
  message,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: SetMaybeRef<UseSignMessageArgs> & UseSignMessageConfig = {}) {
  const options = reactive({
    mutationKey: mutationKey({ message: getMaybeRefValue(message) }),
    mutationFn,
    onError,
    onMutate,
    onSettled,
    onSuccess,
  })

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
  } = useMutation(options)

  const signMessage = computed(() => {
    return (args?: SignMessageArgs) =>
      mutate(args || <SignMessageArgs>{ message: getMaybeRefValue(message) })
  })

  const signMessageAsync = computed(() => {
    return (args?: SignMessageArgs) =>
      mutateAsync(args || <SignMessageArgs>{ message: getMaybeRefValue(message) })
  })

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    signMessage,
    signMessageAsync,
    status,
    variables,
  }
}
