import { actConnect, renderComposable } from '../../../test';
import { useConnect } from '../accounts';
import type {
  UseWaitForTransactionArgs,
  UseWaitForTransactionConfig,
} from './useWaitForTransaction';
import {
  useWaitForTransaction,
} from './useWaitForTransaction';

function useWaitForTransactionWithConnect(
  config: UseWaitForTransactionArgs & UseWaitForTransactionConfig = {},
) {
  return {
    connect: useConnect(),
    waitForTransaction: useWaitForTransaction(config),
  };
}

describe('useWaitForTransaction', () => {
  it('mounts', () => {
    const { result } = renderComposable(() => useWaitForTransaction());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { internal, ...res } = result;
    expect(res).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": null,
        "fetchStatus": "idle",
        "isError": false,
        "isFetched": false,
        "isFetching": false,
        "isIdle": true,
        "isLoading": false,
        "isRefetching": false,
        "isSuccess": false,
        "refetch": [Function],
        "status": "idle",
      }
    `);
  });

  describe('configuration', () => {
    it('chainId,', async () => {
      const hash = '0x6825f7848a2d92e2788cb660ef57d22add152c8c70817c6a62ed58d97bead7c9';
      const utils = renderComposable(() =>
        useWaitForTransactionWithConnect({
          chainId: 1,
          hash,
        }),
      );
      const { nextTick, result, waitFor } = utils;
      await actConnect({ utils });

      nextTick();

      await waitFor(() =>
        expect(result.waitForTransaction.isSuccess).toBeTruthy(),
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, internal, ...res } = result.waitForTransaction;
      expect(data).toBeDefined();
      expect(data.value?.transactionHash).toEqual(hash);
      expect(res).toMatchInlineSnapshot(`
        {
          "error": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetching": false,
          "isIdle": false,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `);
    });

    it('hash', async () => {
      const hash = '0x6825f7848a2d92e2788cb660ef57d22add152c8c70817c6a62ed58d97bead7c9';
      const utils = renderComposable(() =>
        useWaitForTransactionWithConnect({
          hash,
        }),
      );

      const { nextTick, result, waitFor } = utils;

      await actConnect({ utils });

      nextTick();

      await waitFor(() =>
        expect(result.waitForTransaction.isSuccess).toBeTruthy(),
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, internal, ...res } = result.waitForTransaction;
      expect(data).toBeDefined();
      expect(data.value?.transactionHash).toEqual(hash);
      expect(res).toMatchInlineSnapshot(`
        {
          "error": null,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetching": false,
          "isIdle": false,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
        }
      `);
    });
  });
});
