import axios from 'axios'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import https from 'https'
import * as proxy from './proxy.js'

dotenv.config({ path: '.env' })
const app = express()
const port = process.env.VITE_BACKEND_PORT

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

// create application/json parser
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
)
app.use(cors({ credentials: true, origin: true }))
console.log(process.env.CONNECTOR_PORT)
// let connectorUrl = 'https://3.223.70.98:8080'
let connectorUrl = isRunningInDocker()
  ? `http://host.docker.internal:${process.env.CONNECTOR_PORT}`
  : `http://localhost:${process.env.CONNECTOR_PORT}`
console.log(connectorUrl)

let auth = {
  username: 'admin',
  password: 'secret'
}

let httpsAgent = new https.Agent({
  maxVersion: 'TLSv1.2',
  minVersion: 'TLSv1.2',
  rejectUnauthorized: false
})

// initialize health before basicAuth to allow access without authentication
app.use('/health', function (req, res) {
  res.end('OK')
})

// dynamic proxy towards the Dataspace Connector
app.post('/', async (req, res) => {
  let petition = req.body
  console.log(`Received petition ${JSON.stringify(petition)}`)

  // Recoger la cabecera X-User-Email
  const userEmail = req.headers['x-user-email']

  let body = petition.body
  let params = petition.params
  let requestParams = ''
  let i = 0
  if (params != undefined) {
    console.log('Adding request params to the endpointURL')
    for (let key in params) {
      if (i === 0) {
        requestParams += '?' + key + '=' + params[key]
      } else {
        requestParams += '&' + key + '=' + params[key]
      }
      i++
    }
  }
  let dataFromConnector
  let fullURL = `${connectorUrl}${petition.url}${requestParams}`
  console.log(`Sending ${petition.type} request to ${fullURL}`)
  // Cabeceras comunes
  let commonHeaders = {
    'content-type': 'application/json'
  }
  if (userEmail) {
    commonHeaders['X-User-Email'] = userEmail
  }
  switch (petition.type) {
    case 'GET':
      if (petition.url === '/v1/offers')
        var response = await proxy.getAllOffers(fullURL, auth, httpsAgent)
      // else if (petition.url === '/v1/contracts')
      //   var response = await proxy.getAllContracts(fullURL, auth, httpsAgent)
      else
        var response = await axios.get(fullURL, {
          headers: commonHeaders,
          auth,
          httpsAgent
        })
      break
    case 'POST':
      var response = await axios.post(fullURL, body, {
        headers: commonHeaders,
        auth,
        httpsAgent
      })
      break
    case 'PUT':
      var response = await axios.put(fullURL, body, {
        headers: commonHeaders,
        auth,
        httpsAgent
      })
      break
    case 'DELETE':
      var response = await axios.delete(fullURL, {
        data: body,
        headers: commonHeaders,
        auth,
        httpsAgent
      })
      break
  }
  // console.log(response.data)
  dataFromConnector = response?.data
  res.send(dataFromConnector)
})

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})
