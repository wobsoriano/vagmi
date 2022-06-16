export {
  createClient,
  VagmiPlugin,
  VagmiPlugin as Plugin,
  useReadonlyClient as useClient,
} from './plugin';
export type {
  CreateClientConfig,
} from './plugin';

export {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useProvider,
  useNetwork,
  useWebSocketProvider,
  useEnsName,
  useEnsAddress,
  useEnsResolver,
  useEnsAvatar,
  useBlockNumber,
  useFeeData,
  useSigner,
  useSignMessage,
  useSignTypedData
} from './composables';

export {
  Client,
  Connector,
  alchemyRpcUrls,
  allChains,
  chain,
  chainId,
  createStorage,
  defaultChains,
  defaultL2Chains,
  erc20ABI,
  erc721ABI,
  etherscanBlockExplorers,
  infuraRpcUrls,
} from '@wagmi/core';
export type {
  Chain,
  ConnectorData,
  ConnectorEvents,
  Storage,
  Unit,
} from '@wagmi/core';
