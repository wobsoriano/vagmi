import { connect } from '@wagmi/core'
import { isRef } from 'vue'
import { renderComposable, setupClient } from '../../../test'
import { VagmiPlugin } from '../../plugin'
import { useAccount } from './useAccount'
import type { UseQueryReturnType } from '../utils/useQuery'

function unrefAllProperties<T>(result: UseQueryReturnType<T, Error>) {
  const realValues = {}
  Object.keys(result).forEach((key) => {
    // @ts-expect-error: Internal
    realValues[key] = isRef(result[key]) ? result[key].value : result[key]
  })
  return realValues as UseQueryReturnType<T, Error>
}

describe('useAccount', () => {
  describe('mounts', () => {
    it('is connected', async () => {
      const client = setupClient()
      await connect({ connector: client.connectors[0] })

      const { result, waitFor } = renderComposable(() => useAccount(), {
        global: {
          plugins: [
            VagmiPlugin(client)
          ]
        }
      })

      await waitFor(() => result.isSuccess.value)

      const { internal, ...rest } = result

      expect(unrefAllProperties(rest)).toMatchSnapshot()
    })

    it('is not connected', async () => {
      const client = setupClient()

      const { result, waitFor } = renderComposable(() => useAccount(), {
        global: {
          plugins: [
            VagmiPlugin(client)
          ]
        }
      })

      await waitFor(() => result.isSuccess.value)

      const { internal, ...rest } = result

      expect(unrefAllProperties(rest)).toMatchSnapshot()
    })
  })
})
