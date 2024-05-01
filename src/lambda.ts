import mongoose from 'mongoose';
import 'source-map-support/register';
import serverlessExpress from '@codegenie/serverless-express';
import { Context, APIGatewayEvent, APIGatewayProxyCallback } from 'aws-lambda';
import app from './app';
import config from './config/config';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  await mongoose.connect(config.mongoose.url);
  console.log('Connected to MongoDB');
  const serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context, callback);
};
