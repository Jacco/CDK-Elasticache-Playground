import * as crypto from 'crypto';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ArnFormat, CfnResource, FeatureFlags, IResource, Lazy, Names, RemovalPolicy, Resource, Stack, Token, TokenComparison } from 'aws-cdk-lib';
import { ISubnetGroup, SubnetGroup } from './subnet-group';
import { Construct } from 'constructs';
import { MemcachedVersion, RedisVersion } from './enigine';
import { NodeClass, NodeSize, NodeType } from './node-type';
import { Port } from 'aws-cdk-lib/aws-ec2';
import { MaintenanceWindow } from './maintenance-window';
import { ISecurityGroup, SecurityGroup } from './security-group';
import { Endpoint } from './endpoint';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { ElastiCacheResource, ElastiCacheResourceProps } from './cache-cluster-base';
import { SnapshotWindow } from './snapshot-window';
import { CfnCacheCluster } from 'aws-cdk-lib/aws-elasticache';
import { CacheClusterLogDestination } from './log-delivery-configuration-resuest';
import { LogStream } from 'aws-cdk-lib/aws-logs';

/**
 * A CacheCluster
 */
export interface ICacheCluster extends IResource {
  /**
   * The Name of the Cache Cluster
   *
   * @attribute
   */
  readonly cacheClusterName: string;

  /**
   * The cache cluster endpoint address.
   *
   * @attribute ConfigurationEndpointAddress
   */
  readonly configurationEndpointAddress: string;

  /**
   * The cache cluster endpoint port.
   *
   * @attribute ConfigurationEndpointPort
   */
  readonly configurationEndpointPort: string;

  /**
   * The cache cluster endpoint.
   */
  readonly configurationEndpoint: Endpoint;
}

export enum AvailabilityZoneMode {
  CROSS_AZ = "cross-az",

  SINGLE_AZ = "single-az"
}

interface IMemcachedCluster extends IResource {

}

/**
 * Properties for creating a MemcachedCluster.
 */
export interface MemcachedClusterProps extends ElastiCacheResourceProps {
  readonly numCacheNodes: number,
  /**
   * The version number of the memcache engine to be used for this cluster.
   * 
   * Important: You can upgrade to a newer engine version but you cannot downgrade
   * to an earlier engine version. If you want to use an earlier engine version, 
   * you must delete the existing cluster or replication group and create it anew 
   * with the earlier engine version.
   */
  readonly engineVersion: MemcachedVersion,

  /**
   * Preferred maintenance window.
   */
  readonly preferedMaintenanceWindow?: MaintenanceWindow;

  /**
   * Specifies whether the nodes in this Memcached cluster are created in a single 
   * Availability Zone or created across multiple Availability Zones in the 
   * cluster's region.
   * 
   * If the availabilityZonezMode and preferredAvailabilityZones are not specified, ElastiCache 
   * assumes single-az mode.
   */
  readonly availabilityZonezMode?: AvailabilityZoneMode;
  readonly preferedAvailabilityZone?: string;
  readonly preferedAvailabilityZones?: string[];

  /**
   * The Amazon Simple Notification Service (SNS) topic to which notifications are sent.
   * The topic owner must be the same as the cluster owner.
   */
  readonly notificationTopic?: ITopic, 

  readonly engineVersionCausesReplacement?: boolean
}

function calculateClusterHash(cluster: MemcachedCluster) {
  const hash = crypto.createHash('md5');
  hash.update(cluster.engineVersion.version);
  return hash.digest('hex');
}

function trimFromStart(s: string, maxLength: number) {
  const desiredLength = Math.min(maxLength, s.length);
  const newStart = s.length - desiredLength;
  return s.substring(newStart);
}

/**
 * Class for creating a Elasticache cluster with the Memcached engine.
 *
 * @resource AWS::ElastiCache::CacheCluster
 */
export class MemcachedCluster extends ElastiCacheResource implements IMemcachedCluster {

  public readonly clusterName: string;

  public readonly configurationEndpointAddress: string;
  public readonly configurationEndpointPort: string;
  public readonly configurationEndpoint: Endpoint;

  public readonly engineVersion: MemcachedVersion;

  constructor(scope: Construct, id: string, props: MemcachedClusterProps) {
    super(scope, id, {
      ...props,
      port: props.port ?? 11211
    });

    this.engineVersion = props.engineVersion;

    if (props.preferedMaintenanceWindow && props.preferedMaintenanceWindow.durationMinutes < 60) {
      throw new Error('The minimum duration for a maintenance window is 60 minutes');
    }
    if (props.availabilityZonezMode === AvailabilityZoneMode.CROSS_AZ && props.preferedAvailabilityZone) {
      throw new Error('Requesting a single availability zone is not valid for cross-az clusters');
    }
    if (props.preferedAvailabilityZones) {
      if (props.preferedAvailabilityZones.length != props.numCacheNodes) {
        throw new Error(`The number of specified availability zones in preferedAvailabilityZones (${props.preferedAvailabilityZones.length}) must equal the number of cache nodes specified in numCacheNodes (${props.numCacheNodes})`)
      } else {
        const zones = props.vpc.selectSubnets(this.vpcSubnets).availabilityZones
        for (var zone of props.preferedAvailabilityZones) {
          if (zones.indexOf(zone) < 0) {
            throw new Error(`Only availability zones of the specified subnet can be chosen, '${zone}' is not in [${zones}]`)
          }
        }
        if (props.availabilityZonezMode === AvailabilityZoneMode.CROSS_AZ) {
          const az_count = Array.from(new Set(props.preferedAvailabilityZones)).length;
          if (az_count === 1) {
            throw new Error('When specifying availabilityZonezMode as CROSS_AZ and also specify preferedAvailabilityZones it must contains more than 1 usinque availability zone');
          }
        }
      }
    }
    if (props.notificationTopic) {
      const parts = Stack.of(scope).splitArn(props.notificationTopic.topicArn, ArnFormat.SLASH_RESOURCE_NAME);
      if (!Token.isUnresolved(parts.account) && !Token.isUnresolved(this.stack.account) && parts.account != this.stack.account) {
        throw new Error('The topic should be of the same owner as the Cache Cluster');
      }
    }

    const cluster = new CfnCacheCluster(this, 'Resource', {
      engine: props.engineVersion.engineType,
      engineVersion: props.engineVersion.version,
      // cacheParameterGroupName TODO
      // clusterName TODO
      port: this.port, // TODO if it is the default is could be omitted
      cacheSubnetGroupName: this.subnetGroup.subnetGroupName,
      cacheNodeType: props.nodeType.toString(),
      numCacheNodes: props.numCacheNodes,
      vpcSecurityGroupIds: this.securityGroups.length > 0 ? this.securityGroups.map(sg => sg.securityGroupId) : undefined,
      azMode: props.availabilityZonezMode,
      preferredAvailabilityZone: props.availabilityZonezMode == AvailabilityZoneMode.CROSS_AZ ? props.preferedAvailabilityZone : undefined,
      preferredAvailabilityZones: props.preferedAvailabilityZones,
      preferredMaintenanceWindow: props.preferedMaintenanceWindow?.toString(),
      notificationTopicArn: props.notificationTopic?.topicArn
    })

    this.clusterName = cluster.ref
    this.configurationEndpointAddress = cluster.attrConfigurationEndpointAddress;
    this.configurationEndpointPort = cluster.attrConfigurationEndpointPort;

    // create a number token that represents the port of the instance
    const portAttribute = Token.asNumber(cluster.attrConfigurationEndpointPort);
    this.configurationEndpoint = new Endpoint(cluster.attrConfigurationEndpointAddress, portAttribute);

    const originalLogicalId = Stack.of(this).getLogicalId(cluster);
    
    cluster.overrideLogicalId(Lazy.uncachedString({
      produce: () => {
        if (!props.engineVersionCausesReplacement) {
          return originalLogicalId
        }
        const hash = calculateClusterHash(this);
        const logicalId = trimFromStart(originalLogicalId, 255 - 32);
        return `${logicalId}${hash}`;
      },
    }));

    this.applyRemovalPolicy(RemovalPolicy.DESTROY); // TODO
  }
}

export interface IRedisCluster extends IResource {

}

/**
 * Properties for creating a MemcachedCluster.
 */
export interface RedisClusterProps extends ElastiCacheResourceProps {
  readonly numCacheNodes: number,

  /**
   * The version number of the redis engine to be used for this cluster.
   * 
   * Important: You can upgrade to a newer engine version but you cannot downgrade
   * to an earlier engine version. If you want to use an earlier engine version, 
   * you must delete the existing cluster or replication group and create it anew 
   * with the earlier engine version.
   */
  engineVersion: RedisVersion,

  /**
   * The daily time range (in UTC) during which ElastiCache begins taking a daily snapshot of your node group (shard).
   * 
   * If you do not specify this parameter, ElastiCache automatically chooses an appropriate time range.
   */
  snapshotWindow?: SnapshotWindow,

  /**
   * The number of days for which ElastiCache retains automatic snapshots before deleting them. For example, if you
   * set SnapshotRetentionLimit to 5, a snapshot taken today is retained for 5 days before being deleted.
   * 
   * @default 0 (i.e., automatic backups are disabled for this cache cluster).
   */
  snapshotRetentionLimit?: number,

  logs?: [CacheClusterLogDestination]
}

export class RedisCluster extends ElastiCacheResource implements IRedisCluster {
  public readonly connections: ec2.Connections;
  public readonly clusterName: string;
  public readonly redisEndpointAddress: string;
  public readonly redisEndpointPort: string;
  public readonly redisEndpoint: Endpoint;
  public readonly engineVersion: RedisVersion;

  constructor(scope: Construct, id: string, props: RedisClusterProps) {
    super(scope, id, {
      ...props,
      port: props.port ?? 6379
    });

    this.engineVersion = props.engineVersion;

    const logDestinations: CfnCacheCluster.LogDeliveryConfigurationRequestProperty[] = [];
    if (props.logs) {
      for (const log of props.logs) {
        logDestinations.push(log.bind(this, this))
      }
    } else {
      if (props.engineVersion.supportsEngineLog) {
        const destination = CacheClusterLogDestination.engineLogToCloudWatchLogs();
        logDestinations.push(destination.bind(this, this));
      }
      if (props.engineVersion.supportsSlowLog) {
        const destination = CacheClusterLogDestination.slowLogToCloudWatchLogs();
        logDestinations.push(destination.bind(this, this));
      }
    }
 
    const cluster = new CfnCacheCluster(this, 'Resource', {
      engine: props.engineVersion.engineType,
      engineVersion: props.engineVersion.version,
      port: this.port,
      cacheNodeType: props.nodeType.toString(),
      numCacheNodes: props.numCacheNodes,
      cacheSubnetGroupName: this.subnetGroup.subnetGroupName,
      vpcSecurityGroupIds: this.securityGroups.length > 0 ? this.securityGroups.map(sg => sg.securityGroupId) : undefined,
      // autoMinorVersionUpgrade
      // snapshotArns
      // snapshotName
      // autoMinorVersionUpgrade
      // azMode
      // cacheParameterGroupName
      // cacheSecurityGroupNames ??
      // clusterName
      // notificationTopicArn
      // preferredAvailabilityZone
      // preferredAvailabilityZones
      // preferredMaintenanceWindow
      snapshotWindow: props.snapshotWindow?.toString(),
      snapshotRetentionLimit: props.snapshotRetentionLimit,
      logDeliveryConfigurations: logDestinations.length > 0 ? logDestinations : undefined
    });

    this.clusterName = cluster.ref
    this.redisEndpointAddress = cluster.attrRedisEndpointAddress;
    this.redisEndpointPort = cluster.attrRedisEndpointPort;

    // create a number token that represents the port of the instance
    const portAttribute = Token.asNumber(cluster.attrRedisEndpointAddress);
    this.redisEndpoint = new Endpoint(cluster.attrRedisEndpointAddress, portAttribute);

    this.applyRemovalPolicy(RemovalPolicy.DESTROY); // TODO
  }
}