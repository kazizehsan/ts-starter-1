import mongoose from 'mongoose';
import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { Context, APIGatewayEvent, APIGatewayProxyCallback } from 'aws-lambda';
import app from './app.js';
import config from './config/config.js';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  await mongoose.connect(config.mongoose.url);
  console.log('Connected to MongoDB');
  const serverlessExpressInstance = serverlessExpress({ app });
  return serverlessExpressInstance(event, context, callback);
};
