import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket, EventType } from 'aws-cdk-lib/aws-s3';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsDestination } from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MyCdkDemoAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // L1 and L2 construct of an S3 bucket
    const level1S3Bucket = new CfnBucket(this, 'MyFirstlevel1ConstructBucket', {
      versioningConfiguration: {
        status: 'Enabled',
      }
    });

    const level2S3Bucket = new Bucket(this, 'MyFirstlevel2ConstructBucket', {
      versioned: true,
    });

    const queue = new Queue(this, 'MyQueue', {
      queueName: 'MyQueue',
  });

  level2S3Bucket.addEventNotification(EventType.OBJECT_CREATED, new SqsDestination(queue));
  
}
}
