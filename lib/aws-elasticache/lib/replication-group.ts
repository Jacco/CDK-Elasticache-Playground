import { IResource, RemovalPolicy } from "aws-cdk-lib";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { CfnReplicationGroup } from "aws-cdk-lib/aws-elasticache";
import { Construct } from "constructs";
import { ElastiCacheResource, ElastiCacheResourceProps } from "./cache-cluster-base";
import { RedisVersion } from "./enigine";
import { NodeClass } from "./node-type";
import { versionsSupporting } from "./private/util";
import { SnapshotWindow } from "./snapshot-window";

declare global {
    interface Array<T> {
        allOrNone(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
    }
}

if (!Array.prototype.allOrNone) {
  Array.prototype.allOrNone = function<T>(this: T[], predicate: (value: T, index: number, array: T[]) => unknown): boolean {
    return !this.some(predicate) || this.every(predicate)
  }
}

export interface IReplicationGroup extends IResource {

}

export interface ISlots {
    low: number;

    high: number;
}

export abstract class Slots implements ISlots {
    public abstract low: number;
    public abstract high: number;

    static readonly MAX: number = 16383;
    static readonly MIN: number = 0;

    static validate(value?: ISlots) {
        if (value) {
            if (!Number.isInteger(value.low) || !Number.isInteger(value.high)) {
                throw new Error("High and low must be integers");
            }
            if (value.high < Slots.MIN || value.high > Slots.MAX || value.low < Slots.MIN || value.low > Slots.MAX) {
                throw new Error(`High and low integers must be within the range of ${Slots.MIN} until ${Slots.MAX}`);
            }
            if (value.high < value.low) {
                throw new Error("In a slots definition `high` should be greater or equal than `low`");
            }        
        }
    }

    static toString(value?: ISlots): string | undefined {
        return value ? value.low.toString() + '-' + value.high.toString() : undefined;
    }

    static validateComplete(records: ISlots[]) {
        for(let i=0; i<16384; i++) {
            const recordsForSlot = records.filter(x => i>=x.low && i<=x.high)
            if (recordsForSlot.length != 1) {
                if (recordsForSlot.length == 0) {
                    throw new Error(`Slots not complete, hash ${i}, does not appear in ${records.map(x => '['+Slots.toString(x)+']').join(', ')}.`);
                } else {
                    throw new Error(`Slots not complete, hash ${i}, appears in more than one slot definition ${recordsForSlot.map(x => '['+Slots.toString(x)+']').join(', ')}`);
                }
            }
        }
    }
}

export interface INodeGroupConfiguration {
  /** 
   * Either the ElastiCache for Redis supplied 4-digit id or a user supplied id for the node group these 
   * configuration values apply to.
   * 
   * Four digits
   */
   nodeGroupId?: string;

   /**
    * The Availability Zone where the primary node of this node group (shard) is launched.
    */
   primaryAvailabilityZone?: string;

   /**
    * A list of Availability Zones to be used for the read replicas. The number of Availability Zones in 
    * this list must match the value of ReplicaCount or ReplicasPerNodeGroup if not specified.
    */
   replicaAvailabilityZones?: string[];


   /**
    * The number of read replica nodes in this node group (shard).
    */
   replicaCount?: number;

   slots?: ISlots;
}

export interface ReplicationGroupProps extends ElastiCacheResourceProps {
  /**
   * 
   */
  readonly engineVersion: RedisVersion;

  /**
   * A flag that enables encryption at rest when set to true.
   * 
   * You cannot modify the value of AtRestEncryptionEnabled after the replication group is created. 
   * To enable encryption at rest on a replication group you must set AtRestEncryptionEnabled to true
   * when you create the replication group.
   * 
   * Required: Only available when using redis version 3.2.6 or 4.x onward.
   * 
   * @default true if the redis version suports it
   */
  readonly atRestEncryptionEnabled?: boolean;

  /**
   * Specifies whether a read-only replica is automatically promoted to read/write primary if the existing primary fails.
   * 
   * AutomaticFailoverEnabled must be enabled for Redis (cluster mode enabled) replication groups.
   * 
   * @default true if clustered mode is used
   */
  readonly autoMinorVersionUpgrade?: boolean;

  /**
   * An optional parameter that specifies the number of node groups (shards) for this Redis (cluster mode enabled)
   * replication group. For Redis (cluster mode disabled) either omit this parameter or set it to 1.
   * 
   * If you set UseOnlineResharding to true, you can update NumNodeGroups without interruption. When UseOnlineResharding
   * is set to false, or is not specified, updating NumNodeGroups results in replacement.
   * 
   * @default 1
   */
  readonly numNodeGroups?: number;

  readonly dataTieringEnabled?: boolean;

  readonly cacheParameterGroupName?: string;

  /**
   * An optional parameter that specifies the number of replica nodes in each node group (shard). Valid values are 0 to 5.
   */
  readonly replicasPerNodeGroup?: number;

  /**
   * NodeGroupConfiguration is a property of the AWS::ElastiCache::ReplicationGroup resource that configures an Amazon ElastiCache 
   * (ElastiCache) Redis cluster node group. If you set UseOnlineResharding to true, you can update NodeGroupConfiguration without 
   * interruption. When UseOnlineResharding is set to false, or is not specified, updating NodeGroupConfiguration results in 
   * replacement.
   */
  readonly nodeGroupConfiguration?: INodeGroupConfiguration[];

  readonly snapshotWindow?: SnapshotWindow;
}

export class ReplicationGroup extends ElastiCacheResource implements ec2.IConnectable {
    public readonly replicationGroupId: string;

    constructor(scope: Construct, id: string, props: ReplicationGroupProps) {
        super(scope, id, {
            ...props,
            port: props.port ?? 6379
        });

        // todo all features that depend could be combined so the version suggestion could be better
        const atRestEncryptionEnabled: boolean = props.atRestEncryptionEnabled ?? props.engineVersion.supportsAtRestEncryption;
        if (atRestEncryptionEnabled && !props.engineVersion.supportsAtRestEncryption) {
            const supportedVersions = versionsSupporting(version => version.supportsAtRestEncryption);
            throw new Error(`At rest encryption is not supported for redis version ${props.engineVersion.version}. Choose one of the following version: ${supportedVersions.join(', ')}`);
        }
        const autoMinorVersionUpgrade: boolean = props.autoMinorVersionUpgrade ?? props.engineVersion.supportsAutoMinorVersionUpgrade;
        if (autoMinorVersionUpgrade && !props.engineVersion.supportsAutoMinorVersionUpgrade) {
            const supportedVersions = versionsSupporting(version => version.supportsAtRestEncryption);
            throw new Error(`Automatically upgrading minor redis versions is not supported for redis version ${props.engineVersion.version}. Choose one of the following version: ${supportedVersions.join(', ')}`);
        }
        const dataTieringEnabled = props.nodeType.toString().startsWith(`cache.${NodeClass.R6GD}.`);
        if (props.dataTieringEnabled !== undefined && dataTieringEnabled != props.dataTieringEnabled) {
            throw new Error('Datatiering can only be when using a NodeType of the R6GD family.');
        }
        if (props.engineVersion.supportsClusterMode && !props.cacheParameterGroupName && (props.numNodeGroups ?? 1 > 1)) {
            // To create a Redis (cluster mode disabled) replication group, use CacheParameterGroupName=default.redis3.2.
            // To create a Redis (cluster mode enabled) replication group, use CacheParameterGroupName=default.redis3.2.cluster.on.
        }
        if (props.nodeGroupConfiguration) {
            // unique ids if specified
            // slots should have coverage
            const numNodeGroups = props.numNodeGroups ?? 1;
            if (props.nodeGroupConfiguration.length != numNodeGroups) {
                throw new Error('The number of specified NodeGroupConfigurations must equal NumNodeGroups');
            }
            const zones = props.vpc.selectSubnets(this.vpcSubnets).availabilityZones
            for(let i=0; i<numNodeGroups; i++) {
                if (props.nodeGroupConfiguration[i].primaryAvailabilityZone && zones.indexOf(props.nodeGroupConfiguration[i].primaryAvailabilityZone!) < 0) {
                    throw new Error('primaryAvailabilityZone should be one of the selected availability zones')
                }
                if (props.nodeGroupConfiguration[i].replicaAvailabilityZones) {
                    const count = props.nodeGroupConfiguration[i].replicaCount ?? props.replicasPerNodeGroup ?? 0;
                    if (count != props.nodeGroupConfiguration[i].replicaAvailabilityZones?.length) {
                        // throw new Error('The number of specified availability zones for the replicas should equal the number of replicas for the NodeGroup.')
                    }
                }
                if (props.nodeGroupConfiguration[i].slots) {
                    Slots.validate(props.nodeGroupConfiguration[i].slots)
                }
            }
            if (!props.nodeGroupConfiguration.allOrNone(g => g.replicaCount != undefined)) {
                throw new Error('replicaCount must be specified either for ALL of the NodeGroups or for NONE of them.');
            }
            if (!props.nodeGroupConfiguration.allOrNone(g => g.slots)) {
                throw new Error('slots must be specified either for ALL of the NodeGroups or for NONE of them.');
            }
            const allSlots: ISlots[] = props.nodeGroupConfiguration.filter(x => x.slots).map(x => x.slots!);
            
            Slots.validateComplete(allSlots);
        }
        /*
        numCacheClusters 
        - not used when more than 1 shard, use replicasPerNodeGroup, 
        - must be > 2 for autoFaulover
        - defaults to 1 when autoFailover false
        - max 6 (=1 primary + 5 replicas)
        numNodeGroups = shards, clustermode=false omit or set to 1, default = 1
        replicasPerNodeGroup = for all node groups
        */
        
        const group = new CfnReplicationGroup(this, "Resource", {
            engine: props.engineVersion.engineType,
            engineVersion: props.engineVersion.version,
            cacheNodeType: props.nodeType.toString(),
            replicationGroupDescription: '', // todo
            atRestEncryptionEnabled,
            autoMinorVersionUpgrade,
            dataTieringEnabled,
            replicasPerNodeGroup: props.replicasPerNodeGroup,
            nodeGroupConfiguration: props.nodeGroupConfiguration ? props.nodeGroupConfiguration.map(x => {
                return {
                    ...x,
                    slots: Slots.toString(x.slots)
                }
            }) : undefined,
            preferredMaintenanceWindow: props.preferedMaintenanceWindow?.toString(),
            snapshotWindow: props.snapshotWindow?.toString(),
            notificationTopicArn: props.notificationTopic?.topicArn,
            // replicationGroupId
            // multiAzEnabled (not azMode)
            // cacheParameterGroupName
        });

        this.replicationGroupId = group.ref;

        this.applyRemovalPolicy(RemovalPolicy.DESTROY); // TODO
    }
}

/* Metrics */

/* Host-Level */
/*
The AWS/ElastiCache namespace includes the following host-level metrics for individual cache nodes.
CPUUtilization Percent
CPUCreditBalance Credits (vCpu minutes)
CPUCreditUsage Credits (vCpu minutes)
FreeableMemory Bytes
NetworkBytesIn Bytes
NetworkBytesOut Bytes
NetworkPacketsIn Count
NetworkPacketsOut Count
NetworkBandwidthInAllowanceExceeded Count
NetworkConntrackAllowanceExceeded Count
NetworkLinkLocalAllowanceExceeded Count
NetworkBandwidthOutAllowanceExceeded Count
NetworkPacketsPerSecondAllowanceExceeded Count
SwapUsage Bytes
*/
/*
The AWS/ElastiCache namespace includes the following Redis metrics.
ActiveDefragHit	Number
AuthenticationFailures	Count
BytesUsedForCache	Bytes
Dimension: Tier=Memory 	Bytes
Dimension: Tier=SSD 	Bytes
BytesReadFromDisk		Bytes
BytesWrittenToDisk	Bytes
CacheHits		Count
CacheMisses		Count
CommandAuthorizationFailures		Count
CacheHitRate Percent
CurrConnections		Count
CurrItems		Count
Dimension: Tier=Memory 	Count
Dimension: Tier=SSD 	Count
CurrVolatileItems		Count
DatabaseMemoryUsagePercentage		Percent
DatabaseMemoryUsageCountedForEvictPercentage	Percent
DB0AverageTTL		Milliseconds
EngineCPUUtilization	 Percent
Evictions		Count
GlobalDatastoreReplicationLag		Seconds
IsMaster Count
KeyAuthorizationFailures		Count
KeysTracked		Count
MemoryFragmentationRatio		Number
NewConnections		Count
NumItemsReadFromDisk		Count
NumItemsWrittenToDisk		Count
MasterLinkHealthStatus	Boolean
Reclaimed		Count
ReplicationBytes		Bytes
ReplicationLag		Seconds
SaveInProgress		Count
TrafficManagementActive		Boolean

+ more
*/




