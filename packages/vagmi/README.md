# vagmi

[![npm (tag)](https://img.shields.io/npm/v/vagmi?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/vagmi) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/vagmi?style=flat&colorA=000000&colorB=000000) ![NPM](https://img.shields.io/npm/l/vagmi?style=flat&colorA=000000&colorB=000000)

Vue Composables for Ethereum

## Features

- 🚀 Composables for working with wallets, ENS, contracts, transactions, signing, etc.
- 💼 Built-in wallet connectors for MetaMask, WalletConnect, Coinbase Wallet, and Injected
- 👟 Caching, request deduplication, multicall, batching, and persistence
- 🌀 Auto-refresh data on wallet, block, and network changes
- 🦄 TypeScript ready
- 🌳 [WIP] Test suite running against forked Ethereum network

...and a lot more.

## Documentation

For full documentation and examples, visit [vagmi.vercel.app](https://vagmi.vercel.app).

## Installation

Install vagmi and its ethers peer dependency.

```bash
npm install vagmi ethers
```

## Quick Start

Connect a wallet in under 60 seconds.

```ts
import { VagmiPlugin, createClient } from 'vagmi';
import { getDefaultProvider } from 'ethers';
import App from './App.vue';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

const app = createApp(App);
app.use(VagmiPlugin(client));
app.mount('#app');
```

```html
<script setup>
import { useAccount, useConnect, useDisconnect } from 'vagmi'
import { InjectedConnector } from 'vagmi/connectors/injected'

const { address, isConnected } = useAccount()
const { connect } = useConnect({
  connector: new InjectedConnector(),
})
const { disconnect } = useDisconnect()
</script>

<template>
  <div v-if="isConnected">
    Connected to {{ address }}
    <button @click="disconnect">Disconnect</button>
  </div>
  <button v-else @click="connect">
    Connect Wallet
  </button>
</template>
```

In this example, we create a vagmi `Client` and pass it to the `VagmiPlugin` Vue plugin. The client is set up to use the ethers Default Provider and automatically connect to previously connected wallets.

Next, we use the `useConnect` composable to connect an injected wallet (e.g. MetaMask) to the app. Finally, we show the connected account's address with `useAccount` and allow them to disconnect with `useDisconnect`.

We've only scratched the surface for what you can do with vagmi!

## Credits

- [wagmi.sh](https://wagmi.sh/)
- [VueUse](https://vueuse.org/)
- [Vue Query](https://vue-query.vercel.app/)

## License

MIT
