<script setup>
import { useConnect } from 'vagmi'

const {
  activeConnector,
  connect,
  connectors,
  error,
  isConnecting,
  pendingConnector,
} = useConnect()
</script>

<template>
  <div v-if="activeConnector">
    Connected to {{ activeConnector.name }}
  </div>

  <button
    v-for="x in connectors"
    :key="x.id"
    :disabled="!x.ready"
    @click="connect(x)"
  >
    {{ x.name }}
    {{ isConnecting && pendingConnector?.id === x.id ? ' (connecting)' : '' }}
  </button>

  <div v-if="error">
    {{ error.message }}
  </div>
</template>
