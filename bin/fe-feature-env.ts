#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FEFeatureDeployment } from '../lib/fe-feature-deployment';
import { FEFeatureEnvironment } from '../lib/fe-feature-env-stack';

const app = new cdk.App();
const environment = new FEFeatureEnvironment(app, 'FeFeatureEnvStack', {
  
});

new FEFeatureDeployment(app, 'FeFeatureEnvDeployment', {
  bucket:  cdk.Fn.importValue('StaticHostingBucketName'),
  assets: process.env.ASSET_PATH ? process.env.ASSET_PATH : './app'
});