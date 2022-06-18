import { vi } from 'vitest'
import { actConnect, renderComposable } from '../../../test'
import { unrefs } from '../../../test/utils'
import { useAccount } from './useAccount'
import { useConnect } from './useConnect'
import { UseDisconnectConfig, useDisconnect } from './useDisconnect'

function useDisconnectWithConnect(config: UseDisconnectConfig = {}) {
  return { connect: useConnect(), disconnect: useDisconnect(config) }
}

function useDisconnectWithAccountAndConnect() {
  return {
    account: useAccount(),
    connect: useConnect(),
    disconnect: useDisconnect(),
  }
}

describe('useDisconnect', () => {
  it('mounts', () => {
    const { result } = renderComposable(() => useDisconnect())
    expect(unrefs(result)).toMatchInlineSnapshot(`
      {
        "disconnect": [Function],
        "disconnectAsync": [Function],
        "error": null,
        "isError": false,
        "isIdle": true,
        "isLoading": false,
        "isSuccess": false,
        "reset": [Function],
        "status": "idle",
      }
    `)
  })

  describe('configuration', () => {
    it('onSuccess', async () => {
      const onSuccess = vi.fn()
      const utils = renderComposable(() => useDisconnectWithConnect({ onSuccess }))
      const { result, waitFor } = utils

      await actConnect({ utils })

      await result.disconnect.disconnect()
      await waitFor(() =>
        result.disconnect.isSuccess.value
      )
      expect(onSuccess).toBeCalledWith(undefined)
    })
  })

  describe('return value', () => {
    it('disconnect', async () => {
      const utils = renderComposable(() => useDisconnectWithConnect())
      const { result, waitFor } = utils

      await actConnect({ utils })
      expect(result.connect.activeConnector).toMatchInlineSnapshot(
        `"<MockConnector>"`,
      )

      await result.disconnect.disconnect()
      await waitFor(() =>
        result.disconnect.isSuccess.value
      )

      expect(result.connect.activeConnector).toMatchInlineSnapshot(
        `undefined`,
      )
      expect(result.disconnect).toMatchInlineSnapshot(`
        {
          "disconnect": [Function],
          "disconnectAsync": [Function],
          "error": null,
          "isError": false,
          "isIdle": false,
          "isLoading": false,
          "isSuccess": true,
          "reset": [Function],
          "status": "success",
        }
      `)
    })

    it('disconnectAsync', async () => {
      const utils = renderComposable(() => useDisconnectWithConnect())
      const { result, waitFor } = utils

      await actConnect({ utils })
      expect(result.connect.activeConnector).toMatchInlineSnapshot(
        `"<MockConnector>"`,
      )

      await result.disconnect.disconnectAsync()
      await waitFor(() =>
        result.disconnect.isSuccess.value
      )

      expect(result.connect.activeConnector).toMatchInlineSnapshot(
        `undefined`,
      )
      expect(result.disconnect).toMatchInlineSnapshot(`
        {
          "disconnect": [Function],
          "disconnectAsync": [Function],
          "error": null,
          "isError": false,
          "isIdle": false,
          "isLoading": false,
          "isSuccess": true,
          "reset": [Function],
          "status": "success",
        }
      `)
    })
  })

  describe('behavior', () => {
    it('clears account cache', async () => {
      const utils = renderComposable(() => useDisconnectWithAccountAndConnect())
      const { result, nextTick, waitFor } = utils

      await actConnect({ utils })

      expect(result.account.data).toMatchInlineSnapshot(`
        {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "connector": "<MockConnector>",
        }
      `)

      await result.disconnect.disconnect()

      await waitFor(() =>
        result.disconnect.isSuccess.value
      )
      await nextTick()
      expect(result.account.data).toMatchInlineSnapshot(`null`)
    })
  })
})
