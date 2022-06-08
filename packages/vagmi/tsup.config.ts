import { defineConfig } from 'tsup';

const connectors = [
  'coinbaseWallet',
  'metaMask',
  'walletConnect',
  'injected',
];

const providers = [
  'alchemy',
  'infura',
  'jsonRpc',
  'public',
];

export default defineConfig({
  entry: [
    'src/index.ts',
    ...connectors.map(c => `src/connectors/${c}.ts`),
    ...providers.map(p => `src/providers/${p}.ts`),
    'src/chains.ts',
  ],
  dts: true,
  clean: false,
  format: ['cjs', 'esm'],
  splitting: false,
});
