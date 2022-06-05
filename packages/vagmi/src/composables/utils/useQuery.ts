import type { UnwrapRef } from 'vue'
import type { QueryFunction, QueryKey, QueryObserverResult, UseQueryReturnType as _UseQueryReturnType } from 'vue-query'
import { useQuery as _useQuery } from 'vue-query'
import type { VueQueryObserverOptions, WithQueryClientKey } from 'vue-query/lib/vuejs/types'

export type UseQueryReturnType<TData, TError> = Pick<
  _UseQueryReturnType<TData, TError>,
  | 'data'
  | 'error'
  | 'fetchStatus'
  | 'isError'
  | 'isFetched'
  | 'isFetching'
  | 'isLoading'
  | 'isRefetching'
  | 'isSuccess'
  | 'refetch'
> & {
  isIdle: boolean
  status: 'idle' | 'loading' | 'success' | 'error'
  internal: Pick<
    QueryObserverResult,
    | 'dataUpdatedAt'
    | 'errorUpdatedAt'
    | 'failureCount'
    | 'isFetchedAfterMount'
    | 'isLoadingError'
    | 'isPaused'
    | 'isPlaceholderData'
    | 'isPreviousData'
    | 'isRefetchError'
    | 'isStale'
    | 'remove'
  >
}

export type UseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = WithQueryClientKey<
  VueQueryObserverOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>
>

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryReturnType<TData, TError>

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey'
  >
): UseQueryReturnType<TData, TError>

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, UnwrapRef<TQueryKey>>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >
): UseQueryReturnType<TData, TError>

export function useQuery<
  TQueryFnData,
  TError,
  TData = TQueryFnData,
>(...args: any[]): UseQueryReturnType<TData, TError> {
  // @ts-expect-error: Internal
  const result = _useQuery(...args)

  const {
    dataUpdatedAt,
    errorUpdatedAt,
    failureCount,
    isFetchedAfterMount,
    isLoadingError,
    isPaused,
    isPlaceholderData,
    isPreviousData,
    isRefetchError,
    isStale,
    remove,
    ...rest
  } = result

  const internal = {
    dataUpdatedAt,
    errorUpdatedAt,
    failureCount,
    isFetchedAfterMount,
    isLoadingError,
    isPaused,
    isPlaceholderData,
    isPreviousData,
    isRefetchError,
    isStale,
    remove,
  }

  return {
    ...rest,
    internal,
  } as any
}
