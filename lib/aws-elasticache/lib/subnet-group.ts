import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IResource, RemovalPolicy, Resource, Token } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnSubnetGroup } from 'aws-cdk-lib/aws-elasticache';

/**
 * Interface for a subnet group.
 */
export interface ISubnetGroup extends IResource {
  /**
   * The name of the subnet group.
   * @attribute
   */
  readonly subnetGroupName: string;
}

/**
 * Properties for creating a SubnetGroup.
 */
export interface SubnetGroupProps {
  /**
   * Description of the subnet group.
   */
  readonly description: string;

  /**
   * The VPC to place the subnet group in.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The name of the subnet group.
   *
   * @default - a name is generated
   */
  readonly subnetGroupName?: string;

  /**
   * Which subnets within the VPC to associate with this group.
   *
   * @default - private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The removal policy to apply when the subnet group are removed
   * from the stack or replaced during an update.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy
}

/**
 * Class for creating a Elasticache subnet group
 *
 * @resource AWS::ElastiCache::SubnetGroup
 */
export class SubnetGroup extends Resource implements ISubnetGroup {

  /**
   * Imports an existing subnet group by name.
   */
  public static fromSubnetGroupName(scope: Construct, id: string, subnetGroupName: string): ISubnetGroup {
    return new class extends Resource implements ISubnetGroup {
      public readonly subnetGroupName = subnetGroupName;
    }(scope, id);
  }

  public readonly subnetGroupName: string;

  constructor(scope: Construct, id: string, props: SubnetGroupProps) {
    super(scope, id);

    const { subnetIds } = props.vpc.selectSubnets(props.vpcSubnets ?? { subnetType: ec2.SubnetType.PRIVATE_WITH_NAT });

    // Using 'Default' as the resource id for historical reasons (usage from `Instance` and `Cluster`).
    const subnetGroup = new CfnSubnetGroup(this, 'Default', {
      description: props.description,
      // names are actually stored by ElastiCache changed to lowercase on the server side,
      // and not lowercasing them in CloudFormation means things like { Ref }
      // do not work correctly

      // TODO verify if this is needed for RedisCacheCluster
      cacheSubnetGroupName: Token.isUnresolved(props.subnetGroupName)
        ? props.subnetGroupName
        : props.subnetGroupName?.toLowerCase(),
      subnetIds,
    });

    if (props.removalPolicy) {
      subnetGroup.applyRemovalPolicy(props.removalPolicy);
    }

    this.subnetGroupName = subnetGroup.ref;
  }
}
