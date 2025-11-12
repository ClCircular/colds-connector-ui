// lambdas/express_proxy/handler.ts

import app from './index.js'
import serverlessExpress from '@codegenie/serverless-express'

//@ts-ignore
export const handler = serverlessExpress({ app })
