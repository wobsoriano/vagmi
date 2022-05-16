<script setup lang="ts">
import { useAccount } from 'vagmi'
import Connect from './components/Connect.vue'
import Account from './components/Account.vue'
import NetworkSwitcher from './components/NetworkSwitcher.vue'

const { data } = useAccount()
</script>

<template>
  <Connect />
  <template v-if="data">
    <Account />
    <NetworkSwitcher />
  </template>
</template>
