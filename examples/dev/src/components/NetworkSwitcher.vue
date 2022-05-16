<script setup lang="ts">
import { useNetwork } from 'vagmi'

const {
  activeChain,
  chains,
  error,
  isLoading,
  pendingChainId,
  switchNetwork,
} = useNetwork()
</script>

<template>
  <div v-if="activeChain">
    <div>
      Connected to {{ activeChain?.name ?? activeChain?.id }}
      {{ activeChain?.unsupported ? ' (unsupported)' : '' }}
    </div>

    <div v-if="switchNetwork">
      <template v-for="c in chains" :key="c.id">
        <button v-if="c.id === activeChain?.id">
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
