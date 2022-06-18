import { toRaw, unref } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { connect } from '@wagmi/core'
import { renderComposable, setupClient, unrefAllProperties, } from '../../../test'
import { useConnect, UseConnectArgs, UseConnectConfig } from './useConnect'
import { MockConnector } from '@wagmi/core/connectors/mock'
import { getSigners, unrefs } from '../../../test/utils'
import { useDisconnect } from './useDisconnect'

const connector = new MockConnector({
  options: { signer: getSigners()[0]! },
})

const connectorFail = new MockConnector({
  options: {
    flags: { failConnect: true },
    signer: getSigners()[0]!,
  },
})

function useConnectWithDisconnect(
  config: UseConnectArgs & UseConnectConfig = {},
) {
  return {
    connect: useConnect(config),
    disconnect: useDisconnect(),
  }
}

describe('useConnect', () => {
  describe('mounts', () => {
    it('is connected', async () => {
      const client = setupClient()
      await connect({ connector: client.connectors[0]! })

      const { result, waitFor } = renderComposable(() => useConnect(), client)
      await waitFor(() => result.isConnected.value, {
        timeout: 5_000,
      });
      expect(unrefs(result)).toMatchInlineSnapshot(`
        {
          "activeConnector": "<MockConnector>",
          "connect": [Function],
          "connectAsync": [Function],
          "connectors": [
            "<MockConnector>",
          ],
          "data": undefined,
          "error": null,
          "isConnected": true,
          "isConnecting": false,
          "isDisconnected": false,
          "isError": false,
          "isIdle": false,
          "isReconnecting": false,
          "pendingConnector": undefined,
          "reset": [Function],
          "status": "connected",
        }
      `)
    })
    it('is not connected', async () => {
      const { result, waitFor } = renderComposable(() => useConnect())

      await waitFor(() => result.isDisconnected.value, {
        timeout: 5_000,
      });
      expect(unrefs(result)).toMatchInlineSnapshot(`
        {
          "activeConnector": undefined,
          "connect": [Function],
          "connectAsync": [Function],
          "connectors": [
            "<MockConnector>",
          ],
          "data": undefined,
          "error": null,
          "isConnected": false,
          "isConnecting": false,
          "isDisconnected": true,
          "isError": false,
          "isIdle": false,
          "isReconnecting": false,
          "pendingConnector": undefined,
          "reset": [Function],
          "status": "disconnected",
        }
      `)
    })
  })

  describe('configuration', () => {
    describe('connector', () => {
      it('connects', async () => {
        const { result, waitFor } = renderComposable(() => useConnect({ connector }))
        await result.connect.value()
        await waitFor(() => result.isConnected.value, {
          timeout: 5_000,
        });
        const { ...rest } = result;

        expect(unrefs(rest)).toMatchInlineSnapshot(`
          {
            "activeConnector": "<MockConnector>",
            "connect": [Function],
            "connectAsync": [Function],
            "connectors": [
              "<MockConnector>",
            ],
            "data": {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 1,
                "unsupported": false,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            },
            "error": null,
            "isConnected": true,
            "isConnecting": false,
            "isDisconnected": false,
            "isError": false,
            "isIdle": false,
            "isReconnecting": false,
            "pendingConnector": "<MockConnector>",
            "reset": [Function],
            "status": "connected",
          }
        `)
      })

      it('fails connect', async () => {
        const { result, waitFor } = renderComposable(() =>
          useConnect({
            connector: connectorFail,
          }),
        )

        await result.connect.value()
        await waitFor(() => result.isError.value)

        expect(unrefs(result)).toMatchInlineSnapshot(`
          {
            "activeConnector": undefined,
            "connect": [Function],
            "connectAsync": [Function],
            "connectors": [
              "<MockConnector>",
            ],
            "data": undefined,
            "error": [UserRejectedRequestError: User rejected request],
            "isConnected": false,
            "isConnecting": false,
            "isDisconnected": true,
            "isError": true,
            "isIdle": false,
            "isReconnecting": false,
            "pendingConnector": "<MockConnector>",
            "reset": [Function],
            "status": "disconnected",
          }
        `)
      })

      it('onConnect', async () => {
        const onConnect = vi.fn()
        const { result, waitFor } = renderComposable(() =>
          useConnect({ connector, onConnect }),
        )

        await result.connect.value()
        await waitFor(() => result.isConnected.value)
      })
    })

  })

  describe('return value', () => {
    describe('connect', () => {
      it('uses configuration', async () => {
        const { result, waitFor } = renderComposable(() =>
          useConnect({
            connector,
          }),
        )

        await result.connect.value()
        await waitFor(() => result.isConnected.value)

        expect(unrefs(result)).toMatchInlineSnapshot(`
          {
            "activeConnector": "<MockConnector>",
            "connect": [Function],
            "connectAsync": [Function],
            "connectors": [
              "<MockConnector>",
            ],
            "data": {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 1,
                "unsupported": false,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            },
            "error": null,
            "isConnected": true,
            "isConnecting": false,
            "isDisconnected": false,
            "isError": false,
            "isIdle": false,
            "isReconnecting": false,
            "pendingConnector": "<MockConnector>",
            "reset": [Function],
            "status": "connected",
          }
        `)
      })

      it('uses deferred args', async () => {
        const { result, waitFor } = renderComposable(() => useConnect({ connector }))
        const mockConnector = result.connectors.value[0]
        await result.connect.value(mockConnector)
        await waitFor(() => result.isConnected.value)
        expect(unrefs(result)).toMatchInlineSnapshot(`
          {
            "activeConnector": "<MockConnector>",
            "connect": [Function],
            "connectAsync": [Function],
            "connectors": [
              "<MockConnector>",
            ],
            "data": {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 1,
                "unsupported": false,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            },
            "error": null,
            "isConnected": true,
            "isConnecting": false,
            "isDisconnected": false,
            "isError": false,
            "isIdle": false,
            "isReconnecting": false,
            "pendingConnector": "<MockConnector>",
            "reset": [Function],
            "status": "connected",
          }
        `)
      })

      it('connects to unsupported chain', async () => {
        const { result, waitFor } = renderComposable(() => useConnect({ connector }))

        await result.connect.value({ chainId: 69 })

        await waitFor(() => result.isConnected.value)

        expect(unrefs(result)).toMatchInlineSnapshot(`
          {
            "activeConnector": "<MockConnector>",
            "connect": [Function],
            "connectAsync": [Function],
            "connectors": [
              "<MockConnector>",
            ],
            "data": {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 69,
                "unsupported": true,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            },
            "error": null,
            "isConnected": true,
            "isConnecting": false,
            "isDisconnected": false,
            "isError": false,
            "isIdle": false,
            "isReconnecting": false,
            "pendingConnector": "<MockConnector>",
            "reset": [Function],
            "status": "connected",
          }
        `)
      })

      it('connects to supported chain', async () => {
        const { result, waitFor } = renderComposable(() => useConnect({ connector }))

        await result.connect.value({ chainId: 3 })

        await waitFor(() => result.isConnected.value)

        expect(unrefs(result)).toMatchInlineSnapshot(`
          {
            "activeConnector": "<MockConnector>",
            "connect": [Function],
            "connectAsync": [Function],
            "connectors": [
              "<MockConnector>",
            ],
            "data": {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 3,
                "unsupported": false,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            },
            "error": null,
            "isConnected": true,
            "isConnecting": false,
            "isDisconnected": false,
            "isError": false,
            "isIdle": false,
            "isReconnecting": false,
            "pendingConnector": "<MockConnector>",
            "reset": [Function],
            "status": "connected",
          }
        `)
      })

      it('fails', async () => {
        const { result, waitFor } = renderComposable(() =>
          useConnect({
            connector: connectorFail,
          }),
        )

        await result.connect.value()
        await waitFor(() => result.isError.value)

        expect(unrefs(result)).toMatchInlineSnapshot(`
          {
            "activeConnector": undefined,
            "connect": [Function],
            "connectAsync": [Function],
            "connectors": [
              "<MockConnector>",
            ],
            "data": undefined,
            "error": [UserRejectedRequestError: User rejected request],
            "isConnected": false,
            "isConnecting": false,
            "isDisconnected": true,
            "isError": true,
            "isIdle": false,
            "isReconnecting": false,
            "pendingConnector": "<MockConnector>",
            "reset": [Function],
            "status": "disconnected",
          }
        `)
      })
    })

    describe('connectAsync', () => {
      it('uses configuration', async () => {
        const { result, waitFor } = renderComposable(() => useConnect({ connector }))

        const res = await result.connectAsync.value()
        expect(unrefs(res)).toMatchInlineSnapshot(`
          {
            "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "chain": {
              "id": 3,
              "unsupported": false,
            },
            "connector": "<MockConnector>",
            "provider": "<MockProvider>",
          }
        `)

        await waitFor(() => result.isConnected.value)
      })

      it('uses deferred args', async () => {
        const client = setupClient()
        const { result } = renderComposable(() => useConnect({ connector: client.connectors[0]! }))

        const mockConnector = result.connectors.value[0]
        const res = await result.connectAsync.value(mockConnector)
        expect(unrefs(res)).toMatchInlineSnapshot(`
            {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 1,
                "unsupported": false,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            }
          `)
      })

      it('connects to unsupported chain', async () => {
        const { result, waitFor } = renderComposable(() => useConnect({ connector }))

        const res = await result.connectAsync.value({ chainId: 69 })
        expect(unrefs(res)).toMatchInlineSnapshot(`
            {
              "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              "chain": {
                "id": 69,
                "unsupported": true,
              },
              "connector": "<MockConnector>",
              "provider": "<MockProvider>",
            }
          `)

        await waitFor(() => result.isConnected.value)
      })

      it('connects to supported chain', async () => {
        const { result, waitFor } = renderComposable(() => useConnect({ connector }))

        const res = await result.connectAsync.value({ chainId: 3 })
        expect(unrefs(res)).toMatchInlineSnapshot(`
          {
            "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "chain": {
              "id": 3,
              "unsupported": false,
            },
            "connector": "<MockConnector>",
            "provider": "<MockProvider>",
          }
        `)

        await waitFor(() => result.isConnected.value)
      })
    })
  })

  describe('behavior', () => {
    it('connects to unsupported chain', async () => {
      const { result, waitFor } = renderComposable(() =>
        useConnect({
          chainId: 69,
          connector: new MockConnector({
            options: {
              signer: getSigners()[0]!,
            },
          }),
        }),
      )

      await result.connect.value()
      await waitFor(() => result.isConnected.value)
      expect(result.data.value?.chain).toMatchInlineSnapshot(`
        {
          "id": 69,
          "unsupported": true,
        }
      `)
    })

    it('connects to a supported chain', async () => {
      const { result, waitFor } = renderComposable(() =>
        useConnect({
          chainId: 3,
          connector: new MockConnector({
            options: {
              signer: getSigners()[0]!,
            },
          }),
        }),
      )

      result.connect.value()
      await waitFor(() => result.isConnected.value)
      expect(result.data.value?.chain).toMatchInlineSnapshot(`
        {
          "id": 3,
          "unsupported": false,
        }
      `)
    })

    it('updates on disconnect', async () => {
      const { result, waitFor } = renderComposable(() =>
        useConnectWithDisconnect({ connector }),
      )

      await result.connect.connect.value(connector)
      await waitFor(() =>
        result.connect.isConnected.value
      )
      expect(unrefs(result.connect)).toMatchInlineSnapshot(`
        {
          "activeConnector": "<MockConnector>",
          "connect": [Function],
          "connectAsync": [Function],
          "connectors": [
            "<MockConnector>",
          ],
          "data": {
            "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "chain": {
              "id": 3,
              "unsupported": false,
            },
            "connector": "<MockConnector>",
            "provider": "<MockProvider>",
          },
          "error": null,
          "isConnected": true,
          "isConnecting": false,
          "isDisconnected": false,
          "isError": false,
          "isIdle": false,
          "isReconnecting": false,
          "pendingConnector": "<MockConnector>",
          "reset": [Function],
          "status": "connected",
        }
      `)

      await result.disconnect.disconnect()
      await waitFor(() =>
        result.disconnect.isSuccess.value
      )
      expect(unrefs(result.connect)).toMatchInlineSnapshot(`
        {
          "activeConnector": undefined,
          "connect": [Function],
          "connectAsync": [Function],
          "connectors": [
            "<MockConnector>",
          ],
          "data": {
            "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "chain": {
              "id": 3,
              "unsupported": false,
            },
            "connector": "<MockConnector>",
            "provider": "<MockProvider>",
          },
          "error": null,
          "isConnected": false,
          "isConnecting": false,
          "isDisconnected": true,
          "isError": false,
          "isIdle": false,
          "isReconnecting": false,
          "pendingConnector": "<MockConnector>",
          "reset": [Function],
          "status": "disconnected",
        }
      `)
    })

    it('status lifecycle', async () => {
      const client = setupClient({ autoConnect: true })
      await connect({ connector: client.connectors[0]! })

      const { result, waitFor } = renderComposable(() => useConnect(), client)

      await waitFor(() => result.isConnecting.value)
      expect(result.status.value).toMatchInlineSnapshot(`"connecting"`)
      await waitFor(() => result.isConnected.value)
      expect(result.status.value).toMatchInlineSnapshot(`"connected"`)
    })
  })
})
