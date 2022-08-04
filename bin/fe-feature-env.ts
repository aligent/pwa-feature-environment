#!/usr/bin/env node
import { throws } from 'assert';
import * as cdk from 'aws-cdk-lib';
import { FEFeatureDeployment } from '../lib/fe-feature-deployment';
import { FEFeatureEnvironment } from '../lib/fe-feature-env-stack';
import { Preflight } from '../lib/preflight'

const app = new cdk.App();

const artifactDir = '/tmp/deploy'

new Preflight({
  appPath: process.env.BUILD_ARTIFACTS ? process.env.BUILD_ARTIFACTS : (function(){throw "path for build artifacts should be provided"}()),
  commit: process.env.COMMIT_ID ? process.env.COMMIT_ID : new Date().toLocaleString().replace(/\W/g, '').slice(0,4),
  artifactDir: process.env.ARTIFACT_DIR ? process.env.ARTIFACT_DIR : artifactDir,
})

const FeFeatureEnvStack = new FEFeatureEnvironment(app, 'FeFeatureEnvStack', {
  certificateArn: process.env.CERT_ARN ? process.env.CERT_ARN : (function(){throw "certificate arn not specified"}()) ,
  domain: process.env.DOMAIN ? process.env.DOMAIN : (function(){throw "domain name is not specified"}()) ,
  subDomain: process.env.SUBDOMAIN ? process.env.SUBDOMAIN : (function(){throw "subdomain is not an optional parameter"}()),
  ttl: Number(process.env.TTL) ? Number(process.env.TTL) : 10,
});

new FEFeatureDeployment(app, 'FeFeatureEnvDeployment', {
  bucket: cdk.Fn.importValue('StaticHostingBucketName'),
  assets: artifactDir
}).addDependency(FeFeatureEnvStack);