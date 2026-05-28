type BackendPetition = {
  body?: unknown
  clientId?: string
  params?: Record<string, string | number | boolean>
  type: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  useIdentityHub?: boolean
}

const getConfiguredClientId = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID?.trim()
  return clientId ? clientId : undefined
}

export const getBackendUrl = () =>
  import.meta.env.VITE_API_URL ??
  `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`

let isClientRoutingInstalled = false

export const installBackendClientRouting = () => {
  if (isClientRoutingInstalled) {
    return
  }

  const clientId = getConfiguredClientId()
  if (!clientId) {
    return
  }

  const backendUrl = getBackendUrl()
  const nativeFetch = globalThis.fetch.bind(globalThis)

  globalThis.fetch = async (input, init) => {
    if (typeof input !== 'string' || input !== backendUrl) {
      return nativeFetch(input, init)
    }

    const headers = new Headers(init?.headers)
    headers.set('x-client-id', clientId)

    let body = init?.body
    if (typeof body === 'string' && headers.get('Content-Type') === 'application/json') {
      try {
        const parsedBody = JSON.parse(body) as Record<string, unknown>
        body = JSON.stringify({
          ...parsedBody,
          clientId
        })
      } catch (error) {
        console.warn('Unable to inject clientId into backend request body:', error)
      }
    }

    return nativeFetch(input, {
      ...init,
      headers,
      body
    })
  }

  isClientRoutingInstalled = true
}

export const buildBackendRequestOptions = ({
  petition,
  userEmail
}: {
  petition: BackendPetition
  userEmail?: string
}) => {
  const clientId = getConfiguredClientId()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (userEmail) {
    headers['X-User-Email'] = userEmail
  }

  if (clientId) {
    headers['x-client-id'] = clientId
  }

  return {
    method: 'POST',
    body: JSON.stringify({
      ...petition,
      ...(clientId ? { clientId } : {})
    }),
    headers
  }
}
