import { connect } from '@wagmi/core'
import { actConnect, renderComposable, setupClient, unrefAllProperties } from '../../../test'
import { VagmiPlugin } from '../../plugin'
import type { UseAccountConfig } from './useAccount'
import { useAccount } from './useAccount'
import { useConnect } from './useConnect'
import { useDisconnect } from './useDisconnect'

function useAccountWithConnectAndDisconnect(config: UseAccountConfig = {}) {
  return {
    account: useAccount(config),
    connect: useConnect(),
    disconnect: useDisconnect(),
  }
}

describe('useAccount', () => {
  describe('mounts', () => {
    it('is connected', async () => {
      const client = setupClient()
      await connect({ connector: client.connectors[0] })

      const { result, waitFor } = renderComposable(() => useAccount(), client)

      await waitFor(() => result.isSuccess.value)

      const { internal, ...rest } = result

      expect(unrefAllProperties(rest)).toMatchInlineSnapshot(`
        {
          "data": {
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "connector": "<MockConnector>",
          },
          "error": null,
          "errorUpdateCount": 0,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetching": false,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
          "suspense": [Function],
        }
      `)
    })

    it('is not connected', async () => {
      const { result, waitFor } = renderComposable(() => useAccount())

      await waitFor(() => result.isSuccess.value)

      const { internal, ...rest } = result

      expect(unrefAllProperties(rest)).toMatchInlineSnapshot(`
        {
          "data": null,
          "error": null,
          "errorUpdateCount": 0,
          "fetchStatus": "idle",
          "isError": false,
          "isFetched": true,
          "isFetching": false,
          "isLoading": false,
          "isRefetching": false,
          "isSuccess": true,
          "refetch": [Function],
          "status": "success",
          "suspense": [Function],
        }
      `)
    })
  })

  // describe('behavior', () => {
  //   it('updates on connect and disconnect', async () => {
  //     const utils = renderComposable(() => useAccountWithConnectAndDisconnect(), {
  //       global: {
  //         plugins: [
  //           VagmiPlugin()
  //         ]
  //       }
  //     })
  //     const { result, waitFor } = utils

  //     await actConnect({ utils })

  //     await waitFor(() => result.account.isSuccess.value)

  //     const { internal, ...rest } = result.account

  //     expect(unrefAllProperties(rest)).toMatchSnapshot()
  //   })
  // })
})
