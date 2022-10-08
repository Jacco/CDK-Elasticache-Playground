import { NodeType } from "./node-type";
import { ISubnetGroup, SubnetGroup } from "./subnet-group";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Names, RemovalPolicy, Resource } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Port } from "aws-cdk-lib/aws-ec2";

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
}

export class ElastiCacheResource extends Resource implements ec2.IConnectable {

  public readonly connections: ec2.Connections;
  public readonly vpc: ec2.IVpc;
  public readonly vpcSubnets: ec2.SubnetSelection;
  public readonly subnetGroup: ISubnetGroup;
  public readonly port: number;
  public readonly securityGroups: ec2.ISecurityGroup[];

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
  }
}