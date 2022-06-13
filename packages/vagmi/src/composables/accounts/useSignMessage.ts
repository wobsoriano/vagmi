import type { SignMessageArgs, SignMessageResult } from '@wagmi/core';
import { signMessage } from '@wagmi/core';
import { useMutation } from 'vue-query';

import type { MutationConfig } from '../../types';

export type UseSignMessageArgs = Partial<SignMessageArgs>;

export type UseSignMessageConfig = MutationConfig<
  SignMessageResult,
  Error,
  SignMessageArgs
>;

export const mutationKey = (args: UseSignMessageArgs) => [
  { entity: 'signMessage', ...args },
];

const mutationFn = (args: UseSignMessageArgs) => {
  const { message } = args;
  if (!message)
    throw new Error('message is required');
  return signMessage({ message });
};

export function useSignMessage({
  message,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSignMessageArgs & UseSignMessageConfig = {}) {
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
  } = useMutation(mutationKey({ message }), mutationFn, {
    onError,
    onMutate,
    onSettled,
    onSuccess,
  });

  const signMessage = (args?: SignMessageArgs) => mutate(args || <SignMessageArgs>{ message });
  const signMessageAsync = (args?: SignMessageArgs) => mutateAsync(args || <SignMessageArgs>{ message });

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
  };
}
