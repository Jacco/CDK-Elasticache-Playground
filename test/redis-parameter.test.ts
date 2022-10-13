import * as prms from "../lib/aws-elasticache/lib/redis-parameters";

describe('engine', () => {
    test('specified parameters where the value is default do not appear in the output', () => {
      // WHEN
      const x = new prms.RedisParameter26(prms.RedisParameter26.defaults);
      // THEN
      expect(x.toParameterGroup()).toEqual({});
    });

    test('test correct output for redis 2_6 parameter group', () => {
      // WHEN
      const x = new prms.RedisParameter26({
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

    test('defauls have no unset parameters', () => {
      const p = new prms.RedisParameterProps26();
      //prms.RedisParameter2_6.defaults
      for(const key of prms.RedisParameterProps26.parameterKeys) {
        console.log(key)
      }
    })
});  