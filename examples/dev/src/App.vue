<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useAccount, useBalance, useConnect, useDisconnect, useEnsName } from 'vagmi'

const { connect, connectors, error, isConnecting, pendingConnector }
    = useConnect()
const { data: account } = useAccount()
const { disconnect } = useDisconnect()
const { data: balance, isError, isLoading } = useBalance({
  addressOrName: computed(() => account.value?.address),
})
const { data: ensName } = useEnsName({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  enabled: ref(false),
})

watchEffect(() => {
  console.log('ensName', ensName.value)
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
