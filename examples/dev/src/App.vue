<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue'
import { useAccount, useBalance, useConnect, useDisconnect } from 'vagmi'

const { connect, connectors, error, isConnecting, pendingConnector }
    = useConnect()
const { data: account } = useAccount()
const { disconnect } = useDisconnect()
const { data: balance, isError, isLoading } = useBalance({
  addressOrName: computed(() => account.value?.address),
})

watchEffect(() => {
  console.log('account', account.value)
  console.log('balance', balance.value)
  console.log('balance isLoading', isLoading.value)
})
</script>

<template>
  <div>
    <div v-if="account">
      {{ account.address }}
    </div>
    <button
      v-for="c in connectors"
      :key="c.id"
      :disabled="!c.ready"
      @click="connect(c)"
    >
      {{ c.name }}
      {{ !c.ready ? ' (unsupported)' : '' }}
      {{ isConnecting && c.id === pendingConnector?.id ? ' (connecting)' : '' }}
    </button>
    <button @click="disconnect">
      Disconnect
    </button>
    <div v-if="error">
      {{ error.message }}
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
