import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IResource, RemovalPolicy, Resource, Token } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnSecurityGroup, CfnSecurityGroupIngress } from 'aws-cdk-lib/aws-elasticache';

/**
 * Interface for a security group.
 */
export interface ISecurityGroup extends IResource {
  /**
   * The name of the securirty group.
   * @attribute
   */
  readonly securityGroupName: string;

  /**
   * Add an ingress for the current security group
   */
  addIngress(ec2SecurityGroup: ec2.ISecurityGroup, ec2SecurityGroupOwner?: string): void;
}

/**
 * Properties for creating a Securityroup.
 */
export interface SecurityGroupProps {
  /**
   * Description of the security group.
   */
  readonly description: string;

  /**
   * The removal policy to apply when the security group are removed
   * from the stack or replaced during an update.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy
}

/**
 * Class for creating a Elasticache security group
 *
 * @resource AWS::ElastiCache::SecurityGroup
 */
export class SecurityGroup extends Resource implements ISecurityGroup {

  /**
   * Imports an existing subnet group by name.
   */
  public static fromSecurityGroupName(scope: Construct, id: string, securityGroupName: string): ISecurityGroup {
    return new class extends Resource implements ISecurityGroup {
      public readonly securityGroupName = securityGroupName;
      addIngress(ec2SecurityGroup: ec2.ISecurityGroup, ec2SecurityGroupOwner?: string) {
        // TODO
      }
    }(scope, id);
  }

  public readonly securityGroupName: string;

  constructor(scope: Construct, id: string, props: SecurityGroupProps) {
    super(scope, id);

    // Using 'Default' as the resource id for historical reasons (usage from `Instance` and `Cluster`).
    const securityGroup = new CfnSecurityGroup(this, 'Default', {
      description: props.description,
    });

    if (props.removalPolicy) {
        securityGroup.applyRemovalPolicy(props.removalPolicy);
    }

    this.securityGroupName = securityGroup.ref;
  }

  addIngress(ec2SecurityGroup: ec2.ISecurityGroup, ec2SecurityGroupOwner?: string) {
    const scope = ec2SecurityGroup;
    const id = `${this.securityGroupName}-${ec2SecurityGroup.securityGroupId}`;

    // Skip duplicates
    if (scope.node.tryFindChild(id) === undefined) {
      new CfnSecurityGroupIngress(scope, id, {
        cacheSecurityGroupName: this.securityGroupName,
        ec2SecurityGroupName: ec2SecurityGroup.securityGroupId,
        ec2SecurityGroupOwnerId: ec2SecurityGroupOwner
      });
    }
  }
}
