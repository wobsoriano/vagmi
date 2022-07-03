import { connect } from '@wagmi/core';
import { MockConnector } from '@wagmi/core/connectors/mock';

import {
  actConnect,
  renderComposable,
  setupClient,
} from '../../../test';
import { actDisconnect, getSigners, unrefs } from '../../../test/utils';
import type { UseConnectArgs, UseConnectConfig } from './useConnect';
import { useConnect } from './useConnect';
import { useDisconnect } from './useDisconnect';
import type { UseNetworkArgs, UseNetworkConfig } from './useNetwork';
import { useNetwork } from './useNetwork';

function useNetworkWithConnectAndDisconnect(
  config: {
    connect?: UseConnectArgs & UseConnectConfig
    network?: UseNetworkArgs & UseNetworkConfig
  } = {},
) {
  return {
    connect: useConnect(config.connect),
    disconnect: useDisconnect(),
    network: useNetwork(config.network),
  };
}

describe('useNetwork', () => {
  describe('mounts', () => {
    it('is connected', async () => {
      const client = setupClient();
      await connect({ connector: client.connectors[0]! });

      const { result, waitFor } = renderComposable(() => useNetwork(), client);

      await waitFor(() => result.isIdle.value);

      const { activeChain, chains, ...res } = result;
      expect(activeChain.value?.id).toEqual(1);
      expect(chains.value.length).toEqual(5);
      expect(unrefs(res)).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": null,
          "isError": false,
          "isIdle": true,
          "isLoading": false,
          "isSuccess": false,
          "pendingChainId": undefined,
          "reset": [Function],
          "status": "idle",
          "switchNetwork": [Function],
          "switchNetworkAsync": [Function],
          "variables": undefined,
        }
      `);
    });

    it('is not connected', async () => {
      const { result, waitFor } = renderComposable(() => useNetwork());

      await waitFor(() => result.isIdle.value);

      const { chains, ...res } = result;
      expect(chains.value.length).toEqual(5);
      expect(unrefs(res)).toMatchInlineSnapshot(`
        {
          "activeChain": undefined,
          "data": undefined,
          "error": null,
          "isError": false,
          "isIdle": true,
          "isLoading": false,
          "isSuccess": false,
          "pendingChainId": undefined,
          "reset": [Function],
          "status": "idle",
          "switchNetwork": undefined,
          "switchNetworkAsync": undefined,
          "variables": undefined,
        }
      `);
    });
  });

  describe('configuration', () => {
    it('chainId', async () => {
      const { result, waitFor } = renderComposable(() => useNetwork({ chainId: 1 }));

      await waitFor(() => result.isIdle.value);

      const { chains, ...res } = result;
      expect(chains.value.length).toEqual(5);
      expect(unrefs(res)).toMatchInlineSnapshot(`
        {
          "activeChain": undefined,
          "data": undefined,
          "error": null,
          "isError": false,
          "isIdle": true,
          "isLoading": false,
          "isSuccess": false,
          "pendingChainId": undefined,
          "reset": [Function],
          "status": "idle",
          "switchNetwork": undefined,
          "switchNetworkAsync": undefined,
          "variables": undefined,
        }
      `);
    });
  });

  describe('return value', () => {
    describe('switchNetwork', () => {
      it('uses configuration', async () => {
        const utils = renderComposable(() =>
          useNetworkWithConnectAndDisconnect({
            network: {
              chainId: 4,
            },
          }),
        );
        const { result, waitFor, nextTick } = utils;

        await actConnect({ utils });
        nextTick();

        await result.network.switchNetwork.value?.();
        await waitFor(() =>
          result.network.isSuccess.value,
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { activeChain, chains, data, ...res } = result.network;
        expect(activeChain.value?.id).toMatchInlineSnapshot('4');
        expect(data.value?.id).toMatchInlineSnapshot('4');
        expect(unrefs(res)).toMatchInlineSnapshot(`
          {
            "error": null,
            "isError": false,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": true,
            "pendingChainId": 4,
            "reset": [Function],
            "status": "success",
            "switchNetwork": [Function],
            "switchNetworkAsync": [Function],
            "variables": {
              "chainId": 4,
            },
          }
        `);
      });

      it('uses deferred args', async () => {
        const utils = renderComposable(() => useNetworkWithConnectAndDisconnect());
        const { result, waitFor, nextTick } = utils;

        await actConnect({ utils });
        nextTick();
        await result.network.switchNetwork.value?.(4);

        await waitFor(() =>
          result.network.isSuccess.value,
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { activeChain, chains, data, ...res } = result.network;
        expect(activeChain.value?.id).toMatchInlineSnapshot('4');
        expect(data.value?.id).toMatchInlineSnapshot('4');
        expect(unrefs(res)).toMatchInlineSnapshot(`
          {
            "error": null,
            "isError": false,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": true,
            "pendingChainId": 4,
            "reset": [Function],
            "status": "success",
            "switchNetwork": [Function],
            "switchNetworkAsync": [Function],
            "variables": {
              "chainId": 4,
            },
          }
        `);
      });

      it('fails', async () => {
        const connector = new MockConnector({
          options: {
            flags: { failSwitchChain: true },
            signer: getSigners()[0]!,
          },
        });
        const utils = renderComposable(() =>
          useNetworkWithConnectAndDisconnect({
            connect: { connector },
          }),
        );
        const { result, waitFor } = utils;

        await actConnect({ utils, connector });
        await result.network.switchNetwork.value?.(4);
        await waitFor(() => result.network.isError.value);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { activeChain, chains, ...res } = result.network;
        expect(unrefs(res)).toMatchInlineSnapshot(`
          {
            "data": undefined,
            "error": [UserRejectedRequestError: User rejected request],
            "isError": true,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": false,
            "pendingChainId": 4,
            "reset": [Function],
            "status": "error",
            "switchNetwork": [Function],
            "switchNetworkAsync": [Function],
            "variables": {
              "chainId": 4,
            },
          }
        `);
      });

      it('unsupported chain', async () => {
        const utils = renderComposable(() =>
          useNetworkWithConnectAndDisconnect({
            network: { chainId: 69 },
          }),
        );
        const { result, waitFor, nextTick } = utils;

        await actConnect({ utils });
        nextTick();
        await result.network.switchNetwork.value?.();

        await waitFor(() =>
          result.network.isSuccess.value,
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { activeChain, chains, data, ...res } = result.network;
        expect(activeChain.value?.id).toMatchInlineSnapshot('69');
        expect(activeChain.value?.unsupported).toMatchInlineSnapshot('true');
        expect(data.value?.id).toMatchInlineSnapshot('69');
        expect(unrefs(res)).toMatchInlineSnapshot(`
          {
            "error": null,
            "isError": false,
            "isIdle": false,
            "isLoading": false,
            "isSuccess": true,
            "pendingChainId": 69,
            "reset": [Function],
            "status": "success",
            "switchNetwork": [Function],
            "switchNetworkAsync": [Function],
            "variables": {
              "chainId": 69,
            },
          }
        `);
      });
    });

    describe('switchNetworkAsync', () => {
      it('uses configuration', async () => {
        const utils = renderComposable(() =>
          useNetworkWithConnectAndDisconnect({
            network: {
              chainId: 4,
            },
          }),
        );
        const { result, waitFor } = utils;

        await actConnect({ utils });

        const res = await result.network.switchNetworkAsync.value?.();
        expect(res).toMatchInlineSnapshot(`
          {
            "blockExplorers": {
              "default": {
                "name": "Etherscan",
                "url": "https://rinkeby.etherscan.io",
              },
              "etherscan": {
                "name": "Etherscan",
                "url": "https://rinkeby.etherscan.io",
              },
            },
            "ensAddress": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
            "id": 4,
            "name": "Rinkeby",
            "nativeCurrency": {
              "decimals": 18,
              "name": "Rinkeby Ether",
              "symbol": "rETH",
            },
            "network": "rinkeby",
            "rpcUrls": {
              "alchemy": "https://eth-rinkeby.alchemyapi.io/v2",
              "default": "https://eth-rinkeby.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
              "infura": "https://rinkeby.infura.io/v3",
            },
            "testnet": true,
          }
        `);

        await waitFor(() =>
          result.network.isSuccess.value,
        );
      });

      it('throws error', async () => {
        const connector = new MockConnector({
          options: {
            flags: { failSwitchChain: true },
            signer: getSigners()[0]!,
          },
        });
        const utils = renderComposable(() =>
          useNetworkWithConnectAndDisconnect({
            connect: { connector },
          }),
        );
        const { result, waitFor, nextTick } = utils;

        await actConnect({ utils, connector });
        nextTick();
        await expect(
          result.network.switchNetworkAsync.value?.(4),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
          '"User rejected request"',
        );

        await waitFor(() => result.network.isError.value);
      });
    });
  });

  describe('behavior', () => {
    it('updates on connect and disconnect', async () => {
      const utils = renderComposable(() => useNetworkWithConnectAndDisconnect());
      const { result } = utils;

      await actConnect({ utils });
      expect(result.network.activeChain.value?.id).toMatchInlineSnapshot('1');
      await actDisconnect({ utils });
      expect(result.network.activeChain.value).toMatchInlineSnapshot(
        'undefined',
      );
    });

    it('connector does not support programmatic switching', async () => {
      const connector = new MockConnector({
        options: {
          flags: { noSwitchChain: true },
          signer: getSigners()[0]!,
        },
      });
      const utils = renderComposable(() =>
        useNetworkWithConnectAndDisconnect({
          connect: { connector },
        }),
      );
      const { result } = utils;

      await actConnect({ utils, connector });
      try {
        result.network.switchNetwork.value?.(4);
      } catch (error) {
        expect(error).toMatchInlineSnapshot(
          '[TypeError: result.current.network.switchNetwork is not a function]',
        );
      }
    });
  });
});
