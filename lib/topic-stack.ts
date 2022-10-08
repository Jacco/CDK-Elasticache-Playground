import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { ITopic } from 'aws-cdk-lib/aws-sns';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TopicStack extends Stack {

  public readonly topic: ITopic;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.topic = new sns.Topic(this, 'MyTopic', {
      topicName: 'cache-alerts-v2',
    })
  }
}
