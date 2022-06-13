import {
  SignTypedDataArgs,
  SignTypedDataResult,
  signTypedData,
} from '@wagmi/core'
import { useMutation } from 'vue-query'

import { MutationConfig } from '../../types'

export type UseSignTypedDataArgs = Partial<SignTypedDataArgs>

export type UseSignTypedDataConfig = MutationConfig<
  SignTypedDataResult,
  Error,
  SignTypedDataArgs
>

export const mutationKey = (args: UseSignTypedDataArgs) => [
  { entity: 'signTypedData', ...args },
]

const mutationFn = (args: UseSignTypedDataArgs) => {
  const { domain, types, value } = args
  if (!domain || !types || !value)
    throw new Error('domain, types, and value are all required')
  return signTypedData({ domain, types, value })
}

export function useSignTypedData({
  domain,
  types,
  value,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSignTypedDataArgs & UseSignTypedDataConfig = {}) {
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
  } = useMutation(mutationKey({ domain, types, value }), mutationFn, {
    onError,
    onMutate,
    onSettled,
    onSuccess,
  })

  const signTypedData = (args?: SignTypedDataArgs) =>
    mutate(args || <SignTypedDataArgs>{ domain, types, value })

  const signTypedDataAsync = (args?: SignTypedDataArgs) =>
    mutateAsync(args || <SignTypedDataArgs>{ domain, types, value })

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    signTypedData,
    signTypedDataAsync,
    status,
    variables,
  }
}
