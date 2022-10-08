#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CacheGroupStack, CacheTestsTsStack } from '../lib/cache-tests-ts-stack';

const app = new cdk.App();

new CacheGroupStack(app, 'CacheTestsTsStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});