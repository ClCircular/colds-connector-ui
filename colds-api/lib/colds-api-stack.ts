import { Construct } from 'constructs'

import * as cdk from 'aws-cdk-lib'
import {
  RestApi,
  // LambdaIntegration,
  Cors
} from 'aws-cdk-lib/aws-apigateway'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

import * as path from 'path'
import * as dotenv from 'dotenv'

// import * as model from './doc-models'
import { LambdaIntegration } from './LambdaIntegration'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ColdsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    dotenv.config({ path: './.env' })

    /** GET VPC AND PRIVATE SUBNET */
    const vpc = ec2.Vpc.fromLookup(this, 'vpc-colds', { vpcName: 'vpc-colds' })

    const securityGroup = ec2.SecurityGroup.fromLookupByName(
      this,
      'lambda-security-group',
      'default-lambda-security-group-colds',
      vpc
    )
    /********************************************************************/
    /** LAMBDA */
    /********************************************************************/
    const apiLambdaBackend = new Function(this, 'colds-api-function', {
      functionName: 'colds-api',
      handler: 'handler.handler',
      code: Code.fromAsset(path.join(__dirname, `/../dist/lambdas/colds_api/`)),
      runtime: Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      retryAttempts: 0,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      role: new iam.Role(this, 'colds-api-role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        description: 'Role for the lambda function colds-api',
        roleName: 'colds-api-lambda-role',
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaBasicExecutionRole'
          ),
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaVPCAccessExecutionRole'
          )
        ]
      }),
      securityGroups: [securityGroup],
      environment: {
        CONNECTOR_PORT: process.env.CONNECTOR_PORT!,
        CONNECTOR_IP: process.env.CONNECTOR_IP!,
        IDENTITY_HUB_PORT: process.env.IDENTITY_HUB_PORT!
      }
    })

    /********************************************************************/
    /** API */
    /********************************************************************/

    const api = new RestApi(this, 'ColdsAPI', {
      restApiName: 'ColdsAPI',
      description: 'API for the React frontend of COLDS',
      deployOptions: {
        stageName: `v1`
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS // this is also the default
      }
    })

    // Create the integration
    const integration = new LambdaIntegration(apiLambdaBackend, {
      allowTestInvoke: false,
      restApi: api
    })

    api.root.addMethod('ANY', integration)
    api.root.addResource('{proxy+}').addMethod('ANY', integration)

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url })
  }
}
