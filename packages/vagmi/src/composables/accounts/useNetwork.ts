import { toRefs, tryOnScopeDispose } from '@vueuse/core';
import {
  getNetwork,
  watchNetwork,
} from '@wagmi/core';
import { ref } from 'vue';

export function useNetwork() {
  const network = ref(getNetwork());

  const unwatch = watchNetwork((data) => {
    network.value = data;
  });

  tryOnScopeDispose(() => {
    unwatch();
  });

  return toRefs(network);
}
