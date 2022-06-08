import { renderComposable, unrefAllProperties } from '../../../test';
import { useBalance } from './useBalance';

describe('useBalance', () => {
  it('it mounts', async () => {
    const { result, waitFor } = renderComposable(() => useBalance({ addressOrName: 'awkweb.eth' }));

    await waitFor(() => result.isSuccess.value, {
      timeout: 5_000,
    });

    const { internal, ...rest } = result;

    expect(unrefAllProperties(rest)).toMatchInlineSnapshot(`
    {
      "data": {
        "decimals": 18,
        "formatted": "1.622080339908136684",
        "symbol": "ETH",
        "unit": "ether",
        "value": {
          "hex": "0x1682c979995e8eec",
          "type": "BigNumber",
        },
      },
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
