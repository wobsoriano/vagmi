import { createApp } from 'vue'
import App from './App.vue'
import { createClient, defaultChains, VueWagmiPlugin } from 'vue-wagmi'

import { MetaMaskConnector } from 'vue-wagmi/connectors/metaMask'

const chains = defaultChains

// Set up connectors
const client = createClient({
  autoConnect: true,
  connectors() {
    return [
      new MetaMaskConnector({ chains }),
    ]
  },
})

const app = createApp(App)
app.use(VueWagmiPlugin(client))
app.mount('#app')
