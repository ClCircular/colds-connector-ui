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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: true }))

let connectorUrl = process.env.AWS_LAMBDA_FUNCTION_NAME
  ? `http://${process.env.CONNECTOR_IP}:${process.env.CONNECTOR_PORT}`
  : isRunningInDocker()
  ? `http://host.docker.internal:${process.env.CONNECTOR_PORT}`
  : `http://localhost:${process.env.CONNECTOR_PORT}`
console.log('connectorUrl:', connectorUrl)

const credHost =
  process.env.CREDENTIALS_HOST ||
  (isRunningInDocker() ? 'colds-connector-consumer' : 'localhost')
const credPort = process.env.CREDENTIALS_PORT || '20002'
const credentialsUrl = process.env.AWS_LAMBDA_FUNCTION_NAME
  ? `http://${process.env.CONNECTOR_IP}:${credPort}`
  : `http://${credHost}:${credPort}`

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
    let petition = req.body
    console.log(`Received petition ${JSON.stringify(petition)}`)

    const userEmail = req.headers['x-user-email']
    const useIdentityHub = petition.useIdentityHub === true
    const baseUrl = useIdentityHub ? credentialsUrl : connectorUrl

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
