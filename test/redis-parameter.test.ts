import { ApppendFSync, RedisParameter, RedisParameter3_2, RedisParameterProps3_2 } from "../lib/aws-elasticache/lib/redis-parameters";

describe('engine', () => {
    test('check redis slowLog and engineLog support', () => {
      const x = new RedisParameter({
        acl_pubsub_default: 'test',
        appendonly: true,
        appendfsync: ApppendFSync.EVERY_SECOND,
        activerehashing: true
      });

      const y = new RedisParameter3_2({
        
      });

      // WHEN
      console.log(x.toParameterGroup())
    })
});  