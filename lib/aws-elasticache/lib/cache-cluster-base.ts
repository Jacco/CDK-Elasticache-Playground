import { NodeType } from "./node-type";
import { ISubnetGroup, SubnetGroup } from "./subnet-group";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ArnFormat, IResource, Names, RemovalPolicy, Resource, Stack, Token } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Port } from "aws-cdk-lib/aws-ec2";
import { Endpoint } from "./endpoint";
import { MaintenanceWindow } from "./maintenance-window";
import { ITopic } from "aws-cdk-lib/aws-sns";
import { IParameterGroup } from "./redis-parameters";

export interface ElastiCacheResourceProps {
  /**
   * The compute and memory capacity of the nodes in the node group (shard).
   */
  readonly nodeType: NodeType,

  /**
   * The port number on which each of the cache nodes accepts connections.
   * 
   * @default - if a port is not specified the default port is used for
   * the engine type (11211 for memcached, 6379 for redis)
   */
  readonly port?: number,

  /**
   * Existing subnet group for the cache cluster.
   *
   * @default - a new subnet group will be created.
   */
  readonly subnetGroup?: ISubnetGroup;

  /**
   * The VPC network where the cache cluster subnet group should be created.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The type of subnets to add to the created DB subnet group.
   *
   * @default - private subnets with internet access
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The list of security groups to associate with the CacheClusters's network interfaces.
   *
   * @default - if a security group is not specified a dedicated security group will be 
   * created for this function.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Preferred maintenance window.
   */
  readonly preferedMaintenanceWindow?: MaintenanceWindow;

  /**
   * The Amazon Simple Notification Service (SNS) topic to which notifications are sent.
   * The topic owner must be the same as the cluster owner.
   */
  readonly notificationTopic?: ITopic;

  readonly cacheParameterGroup?: IParameterGroup;
}

/**
 * A database instance
 */
 export interface IDatabaseInstance extends IResource, ec2.IConnectable { // todo , secretsmanager.ISecretAttachmentTarget
  /**
   * The instance identifier.
   */
  readonly instanceIdentifier: string;

  /**
   * The instance arn.
   */
  readonly instanceArn: string;

  /**
   * The instance endpoint address.
   *
   * @attribute EndpointAddress
   */
  readonly dbInstanceEndpointAddress: string;

  /**
   * The instance endpoint port.
   *
   * @attribute EndpointPort
   */
  readonly dbInstanceEndpointPort: string;

  /**
   * The instance endpoint.
   */
  readonly instanceEndpoint: Endpoint;

  // ? todo onEvent(id: string, options?: events.OnEventOptions): events.Rule;
}

export class ElastiCacheResource extends Resource implements ec2.IConnectable {

  public readonly connections: ec2.Connections;
  public readonly vpc: ec2.IVpc;
  public readonly vpcSubnets: ec2.SubnetSelection;
  public readonly subnetGroup: ISubnetGroup;
  public readonly port: number;
  public readonly securityGroups: ec2.ISecurityGroup[];

  /**
   * Import an existing database instance.
   */
  // public static fromDatabaseInstanceAttributes(scope: Construct, id: string, attrs: DatabaseInstanceAttributes): IMemcachedCluster {
  //   class Import extends ElastiCacheResource implements IMemcachedCluster {
  //     public readonly defaultPort = ec2.Port.tcp(attrs.port);
  //     public readonly connections = new ec2.Connections({
  //       securityGroups: attrs.securityGroups,
  //       defaultPort: this.defaultPort,
  //     });
  //     public readonly instanceIdentifier = attrs.instanceIdentifier;
  //     public readonly dbInstanceEndpointAddress = attrs.instanceEndpointAddress;
  //     public readonly dbInstanceEndpointPort = Tokenization.stringifyNumber(attrs.port);
  //     public readonly instanceEndpoint = new Endpoint(attrs.instanceEndpointAddress, attrs.port);
  //     public readonly engine = attrs.engine;
  //   }

  //   return new Import(scope, id);
  // }

  constructor(scope: Construct, id: string, props: ElastiCacheResourceProps) {
    super(scope, id);

    this.port = props.port!;
    this.vpc = props.vpc;
    this.vpcSubnets = props.vpcSubnets ?? { subnetType: ec2.SubnetType.PRIVATE_WITH_NAT }; // todo Should this be isolated?
    
    this.subnetGroup = props.subnetGroup ?? new SubnetGroup(this, 'SubnetGroup', {
      description: `Subnet group for ${this.node.id} ElastiCache cluster`,
      vpc: this.vpc,
      vpcSubnets: this.vpcSubnets,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.securityGroups = props.securityGroups ?? [
      new ec2.SecurityGroup(this, 'SecurityGroup', {
          vpc: props.vpc,
          description: 'Automatic security group for CacheCluster ' + Names.uniqueId(this),
      })
    ];

    this.connections = new ec2.Connections({ 
      securityGroups: this.securityGroups, 
      defaultPort: Port.tcp(this.port)
    });

    if (props.notificationTopic) {
      const parts = Stack.of(scope).splitArn(props.notificationTopic.topicArn, ArnFormat.SLASH_RESOURCE_NAME);
      if (!Token.isUnresolved(parts.account) && !Token.isUnresolved(this.stack.account) && parts.account != this.stack.account) {
        throw new Error('The topic should be of the same owner as the Cache Cluster');
      }
      // TODO Topic cannot be encrypted
      // TODO The Amazon SNS topic has to be in the same Region as the ElastiCache cluster.
      // props.notificationTopic.grantPublish(new iam.ServicePrincipal('elasticache.amazonaws.com'));
    }

    if (props.preferedMaintenanceWindow && props.preferedMaintenanceWindow.durationMinutes < 60) {
      throw new Error('The minimum duration for a maintenance window is 60 minutes');
    }
  }
}