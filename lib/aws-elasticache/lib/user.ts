import { IResource, Resource } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnUser } from 'aws-cdk-lib/aws-elasticache';

/**
 * Interface for a user.
 */
export interface IUser extends IResource {
  /**
   * The name of the user.
   * @attribute
   */
  readonly userName: string;

  // TODO status
  // TODO arn
}

/**
 * Properties for creating a User.
 */
export interface UserProps {
    userName: string;

    userId: string;

    passwords?: string[];

    accessString: string;
}

/**
 * Class for creating a Elasticache user
 *
 * @resource AWS::ElastiCache::SubnetGroup
 */
export class User extends Resource implements IUser {

  /**
   * Imports an existing user by name.
   */
  public static fromUserName(scope: Construct, id: string, userName: string): IUser {
    return new class extends Resource implements IUser {
      public readonly userName = userName;
    }(scope, id);
  }

  public readonly userName: string;

  constructor(scope: Construct, id: string, props: UserProps) {
    super(scope, id);

    // TODO passwords in code are bad so use secrets
    if (props.passwords) {
      if (props.passwords.length < 1 || props.passwords.length > 2) {
          throw new Error("When passwords is specified, it must contain either 1 or 2 non-empty passwords");
      }
      if (props.passwords[0].length < 16 || props.passwords[0].length > 128) {
          throw new Error("The password must be longer than 16 characters and at most 128 characters.")
      }
      if (props.passwords.length > 1 && (props.passwords[1].length < 16 || props.passwords[1].length > 128)) {
          throw new Error("The password must be longer than 16 characters and at most 128 characters.")
      }
    }

    const user = new CfnUser(this, 'Resource', {
        engine: 'REDIS',
        userId: props.userId,
        userName: props.userName,

        accessString: props.accessString,
        noPasswordRequired: props.passwords ? false : true,
        passwords: props.passwords
    });

    // TODO removal policy

    this.userName = user.ref;
  }
}
