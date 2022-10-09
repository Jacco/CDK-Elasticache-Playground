import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { PythonFunction } from "@aws-cdk/aws-lambda-python-alpha";
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';

import * as elasticache from './aws-elasticache/lib';

export interface CacheTestsTsStackProps extends StackProps {
}

export class CacheTestsTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: CacheTestsTsStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });

    const bucket = new s3.Bucket(this, "Bucket", {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    });
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
    bucket.grantReadWrite(role);
    const stream = new CfnDeliveryStream(this, "Stream", {
      s3DestinationConfiguration: {
        bucketArn: bucket.bucketArn,
        roleArn: role.roleArn
      },
      deliveryStreamName: 'log-for-redis'
    });

    const redisCache = new elasticache.RedisCluster(this, 'MyClutser', {
      nodeType: elasticache.NodeType.of(elasticache.NodeClass.T2, elasticache.NodeSize.MICRO),
      engineVersion: elasticache.RedisVersion.V6_2,
      numCacheNodes: 1,
      vpc,
      // optional stuff
      snapshotWindow: new elasticache.SnapshotWindow({ startHour: 16, durationMinutes: 60 }),
      snapshotRetentionLimit: 5,
      logs: [
        elasticache.CacheClusterLogDestination.engineLogToKinesisFirehose({
          deliveryStream: stream
        }),
      ],
    });

    const func = new PythonFunction(this, "MyFunction", {
      entry: './src/MyFunction',
      runtime: Runtime.PYTHON_3_7,
      index: 'handler.py',
      handler: 'lambda_handler',
      vpc,
      vpcSubnets: redisCache.vpcSubnets,
      environment: {
        'MEMCACHED_ENDPOINT': redisCache.redisEndpoint.socketAddress
      }
    });

    redisCache.connections.allowDefaultPortFrom(func);
  }
}


export class CacheTestsTsStackMemcached extends Stack {
  constructor(scope: Construct, id: string, props?: CacheTestsTsStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });

    const topic = new sns.Topic(this, 'MyTopic', {
      topicName: 'cache-alerts',
    })

    const cache = new elasticache.MemcachedCluster(this, 'MyClutser', {
      nodeType: elasticache.NodeType.of(elasticache.NodeClass.T2, elasticache.NodeSize.MICRO),
      engineVersion: elasticache.MemcachedVersion.V1_4_14,
      numCacheNodes: 2,
      vpc,
      // optional stuff
      preferedMaintenanceWindow: new elasticache.MaintenanceWindow({ // todo once set you cannot remove the maintenance window
        startDay: elasticache.Weekday.TUESDAY,
        startHour: 22,
        durationMinutes: 180
      }),
      notificationTopic: topic,
      availabilityZonezMode: elasticache.AvailabilityZoneMode.SINGLE_AZ,
      preferedAvailabilityZones: ['eu-west-1a','eu-west-1a'],
      preferedAvailabilityZone: 'eu-west-1a',
    });

    // ? redisCache.addLog(type format destination)

    const func = new PythonFunction(this, "MyFunction", {
      entry: './src/MyFunction',
      runtime: Runtime.PYTHON_3_7,
      index: 'handler.py',
      handler: 'lambda_handler',
      vpc,
      vpcSubnets: cache.vpcSubnets,
      environment: {
        'MEMCACHED_ENDPOINT': cache.configurationEndpoint.socketAddress
      }
    });

    cache.connections.allowDefaultPortFrom(func);
  }
}

export class CacheTestsTsStackRedisWithKinesisLogging extends Stack {
  constructor(scope: Construct, id: string, props?: CacheTestsTsStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });

    const bucket = new s3.Bucket(this, "Bucket", {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY
    });
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
    bucket.grantReadWrite(role);
    const stream = new CfnDeliveryStream(this, "Stream", {
      s3DestinationConfiguration: {
        bucketArn: bucket.bucketArn,
        roleArn: role.roleArn
      },
      deliveryStreamName: 'log-for-redis'
    });

    const redisCache = new elasticache.RedisCluster(this, 'MyClutser', {
      nodeType: elasticache.NodeType.of(elasticache.NodeClass.T2, elasticache.NodeSize.MICRO),
      engineVersion: elasticache.RedisVersion.V6_2,
      numCacheNodes: 1,
      vpc,
      // optional stuff
      snapshotWindow: new elasticache.SnapshotWindow({ startHour: 16, durationMinutes: 60 }),
      snapshotRetentionLimit: 5,
      logs: [
        elasticache.CacheClusterLogDestination.engineLogToKinesisFirehose({
          deliveryStream: stream
        }),
      ]
    });
  }
}


export class CacheGroupStack extends Stack {
  constructor(scope: Construct, id: string, props?: CacheTestsTsStackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });

    //const nt: elasticache.NodeType = elasticache.NodeType.of(elasticache.NodeClass.M1, elasticache.NodeSize.XLARGE16);
    //nt.validate();
    //const nnt: elasticache.NodeType = new elasticache.NodeType('cache.i1.mega');
    //nnt.validate();

    const params = new elasticache.ParameterGroup(this, 'MyParameterGroup', {
      description: 'my desc',
      overrides: new elasticache.RedisParameter3_2({
        databases: 18
      })
    });

    const redisCache = new elasticache.ReplicationGroup(this, 'MyGroup', {
      nodeType: elasticache.NodeType.of(elasticache.NodeClass.T2, elasticache.NodeSize.MICRO),
      engineVersion: elasticache.RedisVersion.V6_2,
      vpc,
      // optional stuff
      //replicasPerNodeGroup: 1,
      numNodeGroups: 2,
      nodeGroupConfiguration: [
        {
          //replicaCount: 0,
          //primaryAvailabilityZone: "eu-west-1a",
          replicaAvailabilityZones: ["eu-west-1a"],
          slots: { low: 0, high: 1 }
        },
        {
          //replicaCount: 0,
          slots: { low: 2, high: 16383 }
        }
      ]
    });
  }
}