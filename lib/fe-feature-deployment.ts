import { Stack, StackProps, aws_s3_deployment as s3Deploy, aws_s3 as s3, Fn, CfnOutput} from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface FEFeatureDeploymentProps extends StackProps {
    readonly bucket: string
    readonly assets: string
}

export class FEFeatureDeployment extends Stack {
  constructor(scope: Construct, id: string, props: FEFeatureDeploymentProps){
    super(scope, id, props);
    
    new s3Deploy.BucketDeployment(this, 'Deployment', {
      sources: [s3Deploy.Source.asset(props.assets)],
      prune: false,
      destinationBucket: s3.Bucket.fromBucketName(this,
          'import-bucket',
          props.bucket)
    });
  }
}