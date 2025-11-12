// lambdas/express_proxy/handler.ts

//@ts-ignore
import app from './app'
import serverlessExpress from '@codegenie/serverless-express'

//@ts-ignore
export const handler = serverlessExpress({ app })
