import type { MaybeRef } from '@vueuse/core';
import { isRef } from 'vue';

export default function getMaybeRefValue<T>(item: MaybeRef<T>) {
  return isRef(item) ? item.value : item;
}
