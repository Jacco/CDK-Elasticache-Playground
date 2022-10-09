import { IResource, Resource } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnUserGroup } from 'aws-cdk-lib/aws-elasticache';
import { IUser } from './user';

/**
 * Interface for a subnet group.
 */
export interface IUserGroup extends IResource {
  /**
   * The name of the subnet group.
   * @attribute
   */
  readonly userGroupId: string;

  // TODO Status
  // TODO Arn

  addUser(user: IUser): void;
}

/**
 * Properties for creating a SubnetGroup.
 */
export interface UserGroupProps {
    userGroupId: string;

    users?: IUser[];
}

/**
 * Class for creating a Elasticache subnet group
 *
 * @resource AWS::ElastiCache::SubnetGroup
 */
export class UserGroup extends Resource implements IUserGroup {

  /**
   * Imports an existing subnet group by name.
   */
  public static fromUserGroupId(scope: Construct, id: string, userGroupId: string): IUserGroup {
    return new class extends Resource implements IUserGroup {
      addUser(user: IUser): void {
          console.log(user);
          throw new Error('Your can not add users to an imported UserGroup.');
      }
      public readonly userGroupId = userGroupId;
    }(scope, id);
  }

  public readonly userGroupId: string;
  private readonly users: IUser[]

  constructor(scope: Construct, id: string, props: UserGroupProps) {
    super(scope, id);

    this.users = props.users ?? [];

    const userGroup = new CfnUserGroup(this, 'Resource', {
        engine: 'REDIS',
        userGroupId: props.userGroupId,
        userIds: this.users.map(u => u.userName)
    });

    // TODO removal policy

    this.userGroupId = userGroup.ref;
  }

  addUser(user: IUser): void {
    this.users.push(user);
  }
}
