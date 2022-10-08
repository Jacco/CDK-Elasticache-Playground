# Work in progress for L2 CDK Constructs for ElastiCache (MemCached and Redis)

The interesting part is in the directory `lib/aws-elasticache`

When finished the purpose is to merge the code into the `aws-cdk` project.

## Coding guidelines

- sensible defaults into the L1 constructs
- minimal external interface (hide anything unnecessary if possible)
- code should prevent errors from CloudFormation validation errors
- add do docs as much as possible for in code completion
- the constructs should behave like other constricts in CDK
- prevent users from adding secrets to the code

# The project also is a CDK project you can use to do intergration tests

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
