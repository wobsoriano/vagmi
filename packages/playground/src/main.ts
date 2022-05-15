import { createApp } from 'vue'
import { VagmiPlugin, createClient, defaultChains } from 'vagmi'

import { MetaMaskConnector } from 'vagmi/connectors/metaMask'
import App from './App.vue'

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
app.use(VagmiPlugin(client))
app.mount('#app')
