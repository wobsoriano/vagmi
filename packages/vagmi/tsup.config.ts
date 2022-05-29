import { defineConfig } from 'tsup'

const connectors = [
  'coinbaseWallet',
  'metaMask',
  'walletConnect',
  'injected',
]

export default defineConfig({
  entry: [
    'src/index.ts',
    ...connectors.map(c => `src/connectors/${c}.ts`),
    'src/chains.ts',
  ],
  dts: true,
  clean: false,
  format: ['cjs', 'esm'],
  splitting: false,
})
