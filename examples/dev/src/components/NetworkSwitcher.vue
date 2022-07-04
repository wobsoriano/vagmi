<script setup lang="ts">
import { useNetwork, useSwitchNetwork } from 'vagmi';

const { chain } = useNetwork();
const {
  chains,
  error,
  isLoading,
  pendingChainId,
  switchNetwork,
} = useSwitchNetwork();
</script>

<template>
  <div>
    <div>
      Connected to {{ chain?.name ?? chain?.id }}
      {{ chain?.unsupported ? ' (unsupported)' : '' }}
    </div>

    <div v-if="switchNetwork">
      <template v-for="c in chains" :key="c.id">
        <button v-if="c.id === chain?.id">
          {{ c.name }}
          {{ isLoading && c.id === pendingChainId ? ' (switching)' : '' }}
        </button>
      </template>
    </div>

    <div v-if="error">
      {{ error.message }}
    </div>
  </div>
</template>
