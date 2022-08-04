import { Stack, StackProps, Duration} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StaticHosting, StaticHostingProps } from '@aligent/cdk-static-hosting';
import { Behavior } from 'aws-cdk-lib/aws-cloudfront';
import validator from '@middy/validator';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface FEFeatureEnvironmentProps extends StackProps {
  readonly subDomain: string
  readonly domain: string
  readonly certificateArn: string
  readonly ttl: number
}

export class FEFeatureEnvironment extends Stack {
  constructor(scope: Construct, id: string, props: FEFeatureEnvironmentProps) {
    super(scope, id, props);

    const HostingStackProps : StaticHostingProps = {
      subDomainName: props.subDomain,
      domainName: props.domain,
      certificateArn: props.certificateArn,
      createDnsRecord: false,
      createPublisherGroup: true,
      createPublisherUser: true,
      enableErrorConfig: true,
      s3ExtendedProps: {
        lifecycleRules: [
          {
            enabled: true,
            expiration: Duration.days(props.ttl),
          }
        ]
      }
    };

    /*
      Static Hosting Resources
    */
    let behaviors: Behavior[] = [];
      behaviors.push(
        {
          pathPattern: `/*`,
          isDefaultBehavior: true,
        },
      )
    
   new StaticHosting(this, 'hosting-stack', {...HostingStackProps, behaviors: behaviors });
  }
}