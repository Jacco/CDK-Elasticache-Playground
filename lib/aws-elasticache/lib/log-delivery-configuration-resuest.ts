import * as logs from 'aws-cdk-lib/aws-logs';
import { CfnDeliveryStream } from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnCacheCluster } from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';
import { RedisCluster } from './cache-cluster';
import { versionsSupporting } from './private/util';

// import { Construct as CoreConstruct } from 'aws-cdk-lib';

enum DestinationType {
  CLOUDWATCH_LOGS = "cloudwatch-logs",

  KINESIS_FIRHOSE = "kinesis-firehose",
}

export enum LogFormat {
  JSON = "json",

  TEXT = "text",
}

export enum LogType {
  SLOW_LOG = "slow-log",

  ENIGINE_LOG = "engine-log"
}

export interface CacheClusterLogDestinationConfig {
  readonly logType: LogType;
  readonly logFormat?: LogFormat;
  readonly logGroup?: logs.ILogGroup;
  readonly deliveryStream?: CfnDeliveryStream;
}

export interface CacheClusterLogDestinationProps {
  readonly logFormat?: LogFormat;
  readonly logGroup?: logs.ILogGroup;
  readonly deliveryStream?: CfnDeliveryStream;
}

/**
 * The destination type for the flow log
 */
export abstract class CacheClusterLogDestination {
  /**
   * Use CloudWatch logs as the destination
   */
  public static slowLogToCloudWatchLogs(props?: CacheClusterLogDestinationProps): CloudWatchLogsDestination {
    return new CloudWatchLogsDestination({
      logType: LogType.SLOW_LOG,
      ...props
    });
  }

  /**
   * Use KinesisFirehose as the destination
   */
  public static slowLogToKinesisFirehose(props?: CacheClusterLogDestinationProps): KinesisFirehoseDestination {
    return new KinesisFirehoseDestination({
      logType: LogType.SLOW_LOG,
      deliveryStream: props?.deliveryStream,
    });
  }

  /**
   * Use CloudWatch logs as the destination
   */
   public static engineLogToCloudWatchLogs(props?: CacheClusterLogDestinationProps): CloudWatchLogsDestination {
    return new CloudWatchLogsDestination({
      logType: LogType.ENIGINE_LOG,
      ...props
    });
  }

  /**
   * Use KinesisFirehose as the destination
   */
  public static engineLogToKinesisFirehose(props?: CacheClusterLogDestinationProps): KinesisFirehoseDestination {
    return new KinesisFirehoseDestination({
      logType: LogType.ENIGINE_LOG,
      deliveryStream: props?.deliveryStream,
    });
  }

  abstract bind(scope: Construct, _cluster: RedisCluster): CfnCacheCluster.LogDeliveryConfigurationRequestProperty;
}

class CacheClusterLogDestinationBase extends CacheClusterLogDestination {
  constructor(protected readonly props: CacheClusterLogDestinationConfig) {
    super();
  }

  validate(cluster: RedisCluster, props: CacheClusterLogDestinationConfig): void {
    if (props.logType == LogType.SLOW_LOG && !cluster.engineVersion.supportsSlowLog) {
      const supportedVersions = versionsSupporting(version => version.supportsSlowLog);
      throw new Error(`Slow-log log delivery is not available for redis engine version ${cluster.engineVersion.version}. Choose one of the following redis versions: ${supportedVersions.join(', ')}.`);
    }
    if (props.logType == LogType.ENIGINE_LOG && !cluster.engineVersion.supportsEngineLog) {
      const supportedVersions = versionsSupporting(version => version.supportsEngineLog);
      throw new Error(`Engine-log log delivery is not available for redis engine version ${cluster.engineVersion.version}. Choose one of the following redis versions: ${supportedVersions.join(', ')}.`);
    }
  }

  bind(_scope: Construct, _cluster: RedisCluster): CfnCacheCluster.LogDeliveryConfigurationRequestProperty {
    throw new Error('Method not implemented.');
  }
}

/**
 *
 */
export class CloudWatchLogsDestination extends CacheClusterLogDestinationBase {
  constructor(props: CacheClusterLogDestinationConfig) {
    super(props);
  }

  // todo should be CoreConstruct in stead of Construct
  public bind(scope: Construct, _cluster: RedisCluster): CfnCacheCluster.LogDeliveryConfigurationRequestProperty {
    this.validate(_cluster, this.props);
    let logGroup: logs.ILogGroup;
    if (this.props.logGroup === undefined) {
      logGroup = new logs.LogGroup(scope, 'LogGroup');
    } else {
      logGroup = this.props.logGroup;
    }
    return {
      destinationType: DestinationType.CLOUDWATCH_LOGS,
      logFormat: this.props.logFormat ?? LogFormat.JSON,
      logType: this.props.logType,
      destinationDetails: {
        cloudWatchLogsDetails: {
          logGroup: logGroup.logGroupName
        }
      }
    }
  }
}

/**
 *
 */
export class KinesisFirehoseDestination extends CacheClusterLogDestinationBase {
  constructor(props: CacheClusterLogDestinationConfig) {
    super(props);
  }

  // todo should be CoreConstruct in stead of Construct
  public bind(_scope: Construct, _cluster: RedisCluster): CfnCacheCluster.LogDeliveryConfigurationRequestProperty {
    this.validate(_cluster, this.props);
    return {
      destinationType: DestinationType.KINESIS_FIRHOSE,
      logFormat: LogFormat.JSON,
      logType: LogType.ENIGINE_LOG,
      destinationDetails: {
        kinesisFirehoseDetails: {
          deliveryStream: this.props.deliveryStream!.deliveryStreamName!
        }
      }
    }
  }
}