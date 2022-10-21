import * as prms from "../lib/aws-elasticache/lib/redis-parameters";

describe('engine', () => {
    test('specified parameters where the value is default do not appear in the output', () => {
      // WHEN
      const r26 = new prms.RedisParameter26(prms.RedisParameter26.defaults);
      const r28 = new prms.RedisParameter28(prms.RedisParameter28.defaults);
      const r32 = new prms.RedisParameter32(prms.RedisParameter32.defaults);
      const r40 = new prms.RedisParameter40(prms.RedisParameter40.defaults);
      const r50 = new prms.RedisParameter50(prms.RedisParameter50.defaults);
      const r6X = new prms.RedisParameter6X(prms.RedisParameter6X.defaults);
      // THEN
      expect(r26.toParameterGroup()).toEqual({});
      expect(r28.toParameterGroup()).toEqual({});
      expect(r32.toParameterGroup()).toEqual({});
      expect(r40.toParameterGroup()).toEqual({});
      expect(r50.toParameterGroup()).toEqual({});
      expect(r50.toParameterGroup()).toEqual({});
      expect(r6X.toParameterGroup()).toEqual({});
    });

    test('test correct output for redis 2_6 parameter group', () => {
      // WHEN
      const group = new prms.RedisParameter26({
        appendonly: true,
        appendfsync: prms.ApppendFSync.ALWAYS,
        activerehashing: false,
        maxmemoryPolicy: prms.MaxMemoryPolicy.ALLKEYS_RANDOM,
      });
      // THEN
      expect(group.toParameterGroup()).toEqual({
        "activerehashing": "no",
        "appendfsync": "always",
        "appendonly": "yes",
        "maxmemory-policy": "allkeys-random"
      });
    });

    test('defauls have no unset parameters', () => {
      expect(prms.RedisParameterProps26.parameterKeys.length).toEqual(Object.keys(prms.RedisParameter26.defaults).length)
      expect(prms.RedisParameterProps28.parameterKeys.length).toEqual(Object.keys(prms.RedisParameter28.defaults).length)
      expect(prms.RedisParameterProps32.parameterKeys.length).toEqual(Object.keys(prms.RedisParameter32.defaults).length)
      expect(prms.RedisParameterProps40.parameterKeys.length).toEqual(Object.keys(prms.RedisParameter40.defaults).length)
      expect(prms.RedisParameterProps50.parameterKeys.length).toEqual(Object.keys(prms.RedisParameter50.defaults).length)
      expect(prms.RedisParameterProps6X.parameterKeys.length).toEqual(Object.keys(prms.RedisParameter6X.defaults).length)
    })

    test('converts to snake case', () => {
      // WHEN
      const group = new prms.RedisParameter26({
        clientOutputBufferLimitNormalHardLimit: 20,
      })
      // THEN
      expect(group.toParameterGroup()).toEqual({
        "client-output-buffer-limit-normal-hard-limit": "20"
      });
    })

    test('Non modifiable properties can not be changed', () => {
      // WHEN
      const group = new prms.RedisParameter26({
        clientOutputBufferLimitPubsubSoftLimit: 40,
      })
      // THEN
      expect(group.toParameterGroup()).toEqual({
        "client-output-buffer-limit-pubsub-soft-limit": "40"
      });
    })

    test('Changing non modifiable generates exception', () => {
      expect(() => {
        const group = new prms.RedisParameter26({
          clientOutputBufferLimitSlaveSoftLimit: 100
        })
      }).toThrow('Non-modifiable parameter clientOutputBufferLimitSlaveSoftLimit was sepcified');
    })
});  