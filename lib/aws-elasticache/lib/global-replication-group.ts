import { Resource } from 'aws-cdk-lib';
import { CfnGlobalReplicationGroup } from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';

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