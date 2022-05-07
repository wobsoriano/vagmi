import type { MaybeRef } from '@vueuse/core'
import type { QueryFunctionContext } from 'vue-query/types'

export type QueryFunctionArgs<T extends (...args: any) => any> =
  QueryFunctionContext<ReturnType<T>>

export type SetMaybeRef<T> = { [KeyType in keyof T]: MaybeRef<T[KeyType]> }
