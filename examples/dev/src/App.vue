<script setup lang="ts">
import { useAccount } from 'vagmi';
import Connect from './components/Connect.vue';
import Account from './components/Account.vue';
import NetworkSwitcher from './components/NetworkSwitcher.vue';

const { isConnected } = useAccount();
</script>

<template>
  <Connect />
  <template v-if="isConnected">
    <Account />
    <NetworkSwitcher />
  </template>
</template>
