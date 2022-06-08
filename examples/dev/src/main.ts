import { createApp } from 'vue';
import { providers } from 'ethers';
import { VagmiPlugin, chain, createClient, defaultChains } from 'vagmi';

import { MetaMaskConnector } from 'vagmi/connectors/metaMask';
import { WalletConnectConnector } from 'vagmi/connectors/walletConnect';
import { InjectedConnector } from 'vagmi/connectors/injected';
import App from './App.vue';

const infuraId = import.meta.env.VITE_INFURA_ID as string;
const chains = defaultChains;
const defaultChain = chain.mainnet;

const isChainSupported = (chainId?: number) =>
  chains.some(x => x.id === chainId);

// Set up connectors
const client = createClient({
  autoConnect: true,
  connectors({ chainId }) {
    const chain = chains.find(x => x.id === chainId) ?? defaultChain;
    const rpcUrl = chain.rpcUrls.infura
      ? `${chain.rpcUrls.infura}/${infuraId}`
      : chain.rpcUrls.default;

    return [
      new MetaMaskConnector({ chains }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
          rpc: { [chain.id]: rpcUrl },
        },
      }),
      new InjectedConnector({ chains, options: { name: 'Injected' } }),
    ];
  },
  provider({ chainId }) {
    return new providers.InfuraProvider(isChainSupported(chainId) ? chainId : defaultChain.id, infuraId);
  },
  // @ts-expect-error: Internal
  webSocketProvider({ chainId }) {
    return new providers.InfuraProvider(
      isChainSupported(chainId) ? chainId : defaultChain.id,
      infuraId,
    );
  },
});

const app = createApp(App);
app.use(VagmiPlugin(client));
app.mount('#app');
