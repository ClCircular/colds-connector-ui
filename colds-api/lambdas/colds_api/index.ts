// app.js  (ESM)
import axios from 'axios'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

function isRunningInDocker() {
  try {
    // Método 1: archivo típico presente en contenedores Docker
    if (fs.existsSync('/.dockerenv')) return true

    // Método 2: cgroup típico con palabra 'docker' en su contenido
    const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8')
    return cgroup.includes('docker') || cgroup.includes('containerd')
  } catch {
    return false
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') })

const app = express()
const port = process.env.VITE_BACKEND_PORT || 3000

type ClientConfig = {
  connectorIp: string
  connectorPort?: string
  credentialsPort?: string
}

type ClientsConfig = Record<string, ClientConfig>

type ProxyPetition = {
  body?: unknown
  clientId?: string
  params?: Record<string, string | number | boolean>
  type: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  useIdentityHub?: boolean
}

const defaultClientId = process.env.DEFAULT_CLIENT_ID || 'default'
const defaultConnectorPort = process.env.CONNECTOR_PORT || '18080'
const defaultCredentialsPort =
  process.env.CREDENTIALS_PORT || process.env.IDENTITY_HUB_PORT || '20002'

function normalizeClientsConfig(config: unknown): ClientsConfig {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return {}
  }

  return Object.entries(config).reduce<ClientsConfig>((acc, [clientId, value]) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return acc
    }

    const candidate = value as ClientConfig
    if (!candidate.connectorIp) {
      return acc
    }

    acc[clientId] = {
      connectorIp: candidate.connectorIp,
      connectorPort: candidate.connectorPort || defaultConnectorPort,
      credentialsPort: candidate.credentialsPort || defaultCredentialsPort
    }

    return acc
  }, {})
}

function buildFallbackClientsConfig(): ClientsConfig {
  if (!process.env.CONNECTOR_IP) {
    return {}
  }

  return {
    [defaultClientId]: {
      connectorIp: process.env.CONNECTOR_IP,
      connectorPort: defaultConnectorPort,
      credentialsPort: defaultCredentialsPort
    }
  }
}

function parseClientsConfig(): ClientsConfig {
  if (!process.env.CLIENTS_CONFIG) {
    return buildFallbackClientsConfig()
  }

  try {
    const parsed = JSON.parse(process.env.CLIENTS_CONFIG)
    const normalized = normalizeClientsConfig(parsed)
    return Object.keys(normalized).length > 0
      ? normalized
      : buildFallbackClientsConfig()
  } catch (error) {
    console.error('Unable to parse CLIENTS_CONFIG:', error)
    return buildFallbackClientsConfig()
  }
}

function resolveClientId(req: express.Request, petition: ProxyPetition) {
  const headerClientId = req.headers['x-client-id']
  const rawClientId = Array.isArray(headerClientId)
    ? headerClientId[0]
    : headerClientId || petition.clientId || defaultClientId

  return String(rawClientId).trim()
}

function buildLocalUrls() {
  const connectorHost = isRunningInDocker()
    ? 'host.docker.internal'
    : 'localhost'
  const credentialsHost =
    process.env.CREDENTIALS_HOST ||
    (isRunningInDocker() ? 'colds-connector-consumer' : 'localhost')

  return {
    connectorUrl: `http://${connectorHost}:${defaultConnectorPort}`,
    credentialsUrl: `http://${credentialsHost}:${defaultCredentialsPort}`
  }
}

const clientsConfig = parseClientsConfig()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: true }))

let auth = { username: 'admin', password: 'secret' }

let httpsAgent = new https.Agent({
  maxVersion: 'TLSv1.2',
  minVersion: 'TLSv1.2',
  rejectUnauthorized: false
})

app.use('/health', function (req, res) {
  res.end('OK')
})

app.post('/', async (req, res) => {
  try {
    const petition = req.body as ProxyPetition
    console.log(`Received petition ${JSON.stringify(petition)}`)

    const userEmail = req.headers['x-user-email']
    const clientId = resolveClientId(req, petition)
    const isLambdaRuntime = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)
    const clientConfig = clientsConfig[clientId]

    if (isLambdaRuntime && !clientConfig) {
      return res.status(404).json({
        error: 'Unknown client',
        details: `Client "${clientId}" is not configured`
      })
    }

    const { connectorUrl, credentialsUrl } = isLambdaRuntime
      ? {
          connectorUrl: `http://${clientConfig!.connectorIp}:${clientConfig!.connectorPort || defaultConnectorPort}`,
          credentialsUrl: `http://${clientConfig!.connectorIp}:${clientConfig!.credentialsPort || defaultCredentialsPort}`
        }
      : buildLocalUrls()

    const useIdentityHub = petition.useIdentityHub === true
    const baseUrl = useIdentityHub ? credentialsUrl : connectorUrl
    console.log(`Resolved client "${clientId}" to baseUrl ${baseUrl}`)

    const body = petition.body
    const params = petition.params
    let requestParams = ''
    if (params) {
      const entries = Object.entries(params)
      requestParams =
        entries.length > 0
          ? '?' + entries.map(([k, v]) => `${k}=${v}`).join('&')
          : ''
    }

    const fullURL = `${baseUrl}${petition.url}${requestParams}`
    console.log(`Sending ${petition.type} request to ${fullURL}`)

    const commonHeaders: {
      [key: string]: string
    } = { 'content-type': 'application/json' }
    if (userEmail) commonHeaders['X-User-Email'] = String(userEmail)

    let response
    switch (petition.type) {
      case 'GET':
        // if (!useIdentityHub && petition.url === '/v1/offers') {
        //   response = await proxy.getAllOffers(fullURL, auth, httpsAgent)
        // } else {
        response = await axios.get(fullURL, {
          headers: commonHeaders,
          auth: useIdentityHub ? undefined : auth,
          httpsAgent
        })
        // }
        break
      case 'POST':
        response = await axios.post(fullURL, body, {
          headers: commonHeaders,
          auth: useIdentityHub ? undefined : auth,
          httpsAgent
        })
        break
      case 'PUT':
        response = await axios.put(fullURL, body, {
          headers: commonHeaders,
          auth: useIdentityHub ? undefined : auth,
          httpsAgent
        })
        break
      case 'DELETE':
        response = await axios.delete(fullURL, {
          data: body,
          headers: commonHeaders,
          auth: useIdentityHub ? undefined : auth,
          httpsAgent
        })
        break
      default:
        return res.status(400).json({ error: 'Unsupported method' })
    }

    res.send(response?.data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal error', details: String(err) })
  }
})

// Solo para desarrollo local
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`)
  })
}

export default app
