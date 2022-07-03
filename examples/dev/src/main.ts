import { createApp } from 'vue';
import { VagmiPlugin, configureChains, createClient, defaultChains } from 'vagmi';

import { infuraProvider } from 'vagmi/providers/infura';
import { MetaMaskConnector } from 'vagmi/connectors/metaMask';
import { WalletConnectConnector } from 'vagmi/connectors/walletConnect';
import { InjectedConnector } from 'vagmi/connectors/injected';
import App from './App.vue';

const infuraId = import.meta.env.VITE_INFURA_ID as string;

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ infuraId }),
]);

// Set up connectors
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const app = createApp(App);
app.use(VagmiPlugin(client));
app.mount('#app');
