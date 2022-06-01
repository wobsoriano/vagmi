# vagmi

Vue Composables for Ethereum

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
import { VagmiPlugin, createClient } from 'vagmi'
import App from './App.vue'

const client = createClient()

const app = createApp(App)
app.use(VagmiPlugin(client))
app.mount('#app')
```

```html
<script setup>
import { computed } from 'vue'
import { useAccount, useConnect, useEnsName } from 'vagmi'
import { InjectedConnector } from 'vagmi/connectors/injected'

const { data: account } = useAccount()
const { data: ensName } = useEnsName({
  address: computed(() => account.value?.address),
})
const { connect } = useConnect({
  connector: new InjectedConnector(),
})
</script>

<template>
  <div v-if="account">
    Connected to {{ ensName ?? account.address }}
  </div>
  <button v-else @click="connect">
    Connect Wallet
  </button>
</template>
```

In this example, we create a vagmi `Client` and pass it to the `VagmiPlugin` plugin. Next, we use the `useConnect` hook to connect an injected wallet (e.g. MetaMask) to the app. Finally, we show the connected account's address with `useAccount` and allow them to disconnect with `useDisconnect`.

## Credits

- [wagmi.sh](https://wagmi.sh/)
- [VueUse](https://vueuse.org/)
- [Vue Query](https://vue-query.vercel.app/)

## License

MIT
