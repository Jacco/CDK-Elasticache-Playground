import { Resource } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { CfnGlobalReplicationGroup } from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';
import { ElastiCacheResource, ElastiCacheResourceProps } from './cache-cluster-base';

export interface ReplicationGroupProps {
    
}

export class GlobalReplicationGroup extends Resource {
    constructor(scope: Construct, id: string, props: ReplicationGroupProps) {
        super(scope, id, {
            ...props
        });

        new CfnGlobalReplicationGroup(this, "Resource", {
            // automaticFailoverEnabled
            members: []
            // cacheNodeType
            // cacheParameterGroupName
            // engineVersion
            // globalNodeGroupCount
            // globalReplicationGroupDescription
            // globalReplicationGroupIdSuffix
            // regionalConfigurations
        })
    }
}