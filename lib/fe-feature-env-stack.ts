import { Stack, StackProps, aws_s3_deployment as s3Deploy, aws_s3 as s3, Fn} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StaticHosting, StaticHostingProps } from '@aligent/cdk-static-hosting';
import { Behavior } from 'aws-cdk-lib/aws-cloudfront';
import { assert } from 'console';
import { Bucket } from 'aws-cdk-lib/aws-s3';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

const HostingStackProps : StaticHostingProps = {
  subDomainName: 'fetest',
  domainName: 'bizkt.com.au',
  certificateArn: 'arn:aws:acm:us-east-1:166381158005:certificate/64b49688-5db3-4665-aa62-45673ff356eb',
  createDnsRecord: false,
  createPublisherGroup: true,
  createPublisherUser: true,
  enableErrorConfig: true
};
export class FEFeatureEnvironment extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /*
      Static Hosting Resources
    */
    let behaviors: Behavior[] = [];
      behaviors.push(
        {
          pathPattern: `/*`,
          isDefaultBehavior: true,
        }
      )
    
   new StaticHosting(this, 'hosting-stack', {...HostingStackProps, behaviors: behaviors });
  }
}