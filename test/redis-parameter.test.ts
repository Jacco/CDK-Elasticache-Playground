import * as prms from "../lib/aws-elasticache/lib/redis-parameters";

describe('engine', () => {
    test('specified parameters where the value is default do not appear in the output', () => {
      // WHEN
      const x = new prms.RedisParameter2_6(prms.RedisParameter2_6.defaults);
      // THEN
      expect(x.toParameterGroup()).toEqual({});
    });

    test('test correct output for redis 2_6 parameter group', () => {
      // WHEN
      const x = new prms.RedisParameter2_6({
        appendonly: true,
        appendfsync: prms.ApppendFSync.ALWAYS,
        activerehashing: false
      });
      // THEN
      expect(x.toParameterGroup()).toEqual({
        "activerehashing": "no",
        "appendfsync": "always",
        "appendonly": "yes",
      });
    });

    // test if defaults have no unset vars.
});  