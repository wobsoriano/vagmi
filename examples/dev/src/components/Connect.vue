<script setup lang="ts">
import { useConnect, useDisconnect } from 'vagmi'
import { computed, watch } from 'vue'

const {
  activeConnector,
  connect,
  connectors,
  error,
  isConnecting,
  pendingConnector,
} = useConnect()
const { disconnect } = useDisconnect()

const filteredConnectors = computed(() => {
  return connectors.value.filter(c => c.ready && c.id !== activeConnector.value?.id)
})

watch(activeConnector, (val) => {
  console.log('Active connector', val)
})
</script>

<template>
  <div>
    <div>
      <button v-if="activeConnector" @click="disconnect()">
        Disconnect from {{ activeConnector.name }}
      </button>

      <button v-for="c in filteredConnectors" :key="c.id" @click="connect(c)">
        {{ c.name }}
        {{ isConnecting && c.id === pendingConnector?.id ? ' (connecting)' : '' }}
      </button>
    </div>

    <div v-if="error">
      {{ error.message }}
    </div>
  </div>
</template>
